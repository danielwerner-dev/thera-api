import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Product } from "./entities/product.entity"
import type { CreateProductDto } from "./dto/create-product.dto"
import type { UpdateProductDto } from "./dto/update-product.dto"

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto)
    return this.productsRepository.save(product)
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find()
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } })
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`)
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id)

    // Atualiza apenas os campos fornecidos
    Object.assign(product, updateProductDto)

    return this.productsRepository.save(product)
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id)
    await this.productsRepository.remove(product)
  }
}
