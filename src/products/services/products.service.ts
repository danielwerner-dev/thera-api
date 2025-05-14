import { Injectable, NotFoundException } from "@nestjs/common"
import type { Product } from "../entities/product.entity"
import type { CreateProductDto } from "../dto/create-product.dto"
import type { UpdateProductDto } from "../dto/update-product.dto"
import type { IProductsService } from "../interfaces/products-service.interface"
import type { IProductRepository } from "../interfaces/product-repository.interface"

@Injectable()
export class ProductsService implements IProductsService {
  constructor(private readonly productRepository: IProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto)
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll()
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne(id)
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`)
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productRepository.update(id, updateProductDto)
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.remove(id)
  }
}
