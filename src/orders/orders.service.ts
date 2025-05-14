import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { DataSource, Repository } from "typeorm"
import { Order } from "./entities/order.entity"
import { OrderItem } from "./entities/order-item.entity"
import { Product } from "../products/entities/product.entity"
import type { CreateOrderDto } from "./dto/create-order.dto"
import { OrderStatus } from "./enums/order-status.enum"

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, readonly productsRepository: Repository<Product>,
    private dataSource: DataSource
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Iniciar transação
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Verificar disponibilidade de estoque e calcular total
      let total_pedido = 0
      const orderItems: OrderItem[] = []
      const productsToUpdate: Product[] = []

      // Buscar todos os produtos de uma vez para evitar múltiplas consultas
      const productIds = createOrderDto.items.map((item) => item.productId)
      const products = await this.productsRepository.findByIds(productIds)

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

        // Verificar estoque
        if (product.quantidade_estoque < itemDto.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${product.nome}. Disponível: ${product.quantidade_estoque}`,
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

        // Atualizar estoque
        product.quantidade_estoque -= itemDto.quantidade
        productsToUpdate.push(product)
      }

      // Salvar itens do pedido
      await queryRunner.manager.save(OrderItem, orderItems)

      // Atualizar total do pedido
      savedOrder.total_pedido = total_pedido
      await queryRunner.manager.save(Order, savedOrder)

      // Atualizar estoque dos produtos
      await queryRunner.manager.save(Product, productsToUpdate)

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
    return this.ordersRepository.find({
      relations: ["items", "items.product"],
    })
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ["items", "items.product"],
    })

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`)
    }

    return order
  }
}
