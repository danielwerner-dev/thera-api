import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import type { DataSource } from "typeorm"
import { Order } from "../entities/order.entity"
import { OrderItem } from "../entities/order-item.entity"
import type { CreateOrderDto } from "../dto/create-order.dto"
import { OrderStatus } from "../enums/order-status.enum"
import type { IOrdersService } from "../interfaces/orders-service.interface"
import type { IOrderRepository } from "../interfaces/order-repository.interface"
import type { IProductRepository } from "../../products/interfaces/product-repository.interface"
import { Inject } from "@nestjs/common"
import { Product } from "../../products/entities/product.entity"

@Injectable()
export class OrdersService implements IOrdersService {
  constructor(
    @Inject("IOrderRepository")
    private readonly orderRepository: IOrderRepository,
    @Inject("IProductRepository")
    private readonly productRepository: IProductRepository,
    private dataSource: DataSource,
  ) {}

  asyncnc
  create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Iniciar transação
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction("SERIALIZABLE") // Nível de isolamento mais alto para garantir consistência

    try {
      // Verificar disponibilidade de estoque e calcular total
      let total_pedido = 0
      const orderItems: OrderItem[] = []
      const productsToUpdate = []

      // Buscar todos os produtos de uma vez para evitar múltiplas consultas
      const productIds = createOrderDto.items.map((item) => item.productId)
      const products = await this.productRepository.findByIds(productIds)

      // Verificar se todos os produtos existem
      if (products.length !== productIds.length) {
        throw new NotFoundException("Um ou mais produtos não foram encontrados")
      }

      // Criar o pedido
      const order = new Order()
      order.total_pedido = 0
      order.status = OrderStatus.PENDENTE
      const savedOrder = await queryRunner.manager.save(Order, order)

      // Processar cada item do pedido
      for (const itemDto of createOrderDto.items) {
        const product = products.find((p) => p.id === itemDto.productId)

        // Verificar estoque com bloqueio para evitar condições de corrida
        const currentProduct = await queryRunner.manager
          .createQueryBuilder()
          .select("product")
          .from(Product, "product")
          .where("product.id = :id", { id: product.id })
          .setLock("pessimistic_write") // Bloqueio de escrita
          .getOne()

        if (!currentProduct || currentProduct.quantidade_estoque < itemDto.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${product.nome}. Disponível: ${
              currentProduct ? currentProduct.quantidade_estoque : 0
            }`,
          )
        }

        // Criar item do pedido
        const orderItem = new OrderItem()
        orderItem.order = savedOrder
        orderItem.product = product
        orderItem.productId = product.id
        orderItem.quantidade = itemDto.quantidade
        orderItem.preco_unitario = product.preco
        orderItem.subtotal = product.preco * itemDto.quantidade

        orderItems.push(orderItem)
        total_pedido += orderItem.subtotal

        // Atualizar estoque diretamente no banco de dados
        await queryRunner.manager
          .createQueryBuilder()
          .update(Product)
          .set({ quantidade_estoque: () => `quantidade_estoque - ${itemDto.quantidade}` })
          .where("id = :id", { id: product.id })
          .execute()
      }

      // Salvar itens do pedido
      await queryRunner.manager.save(OrderItem, orderItems)

      // Atualizar total do pedido
      savedOrder.total_pedido = total_pedido
      await queryRunner.manager.save(Order, savedOrder)

      // Commit da transação
      await queryRunner.commitTransaction()

      return this.findOne(savedOrder.id)
    } catch (error) {
      // Rollback em caso de erro
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Liberar o queryRunner
      await queryRunner.release()
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll()
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id)
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`)
    }
    return order
  }
}
