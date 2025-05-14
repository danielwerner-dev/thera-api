import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Product } from "../entities/product.entity"
import type { CreateProductDto } from "../dto/create-product.dto"
import type { UpdateProductDto } from "../dto/update-product.dto"
import type { IProductRepository } from "../interfaces/product-repository.interface"

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.repository.create(createProductDto)
    return this.repository.save(product)
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find()
  }

  async findOne(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } })
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id)
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`)
    }

    Object.assign(product, updateProductDto)
    return this.repository.save(product)
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id)
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`)
    }

    await this.repository.remove(product)
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.repository.createQueryBuilder("product").whereInIds(ids).getMany()
  }

  async decreaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id)
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`)
    }

    // Usar uma consulta SQL direta para garantir atomicidade
    await this.repository
      .createQueryBuilder()
      .update(Product)
      .set({ quantidade_estoque: () => `quantidade_estoque - ${quantity}` })
      .where("id = :id", { id })
      .andWhere("quantidade_estoque >= :quantity", { quantity })
      .execute()

    // Buscar o produto atualizado
    const updatedProduct = await this.findOne(id)
    if (!updatedProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`)
    }

    return updatedProduct
  }
}
