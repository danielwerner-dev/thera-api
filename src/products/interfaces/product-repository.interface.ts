import type { Product } from "../entities/product.entity"
import type { CreateProductDto } from "../dto/create-product.dto"
import type { UpdateProductDto } from "../dto/update-product.dto"

export interface IProductRepository {
  create(createProductDto: CreateProductDto): Promise<Product>
  findAll(): Promise<Product[]>
  findOne(id: string): Promise<Product | null>
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>
  remove(id: string): Promise<void>
  findByIds(ids: string[]): Promise<Product[]>
  decreaseStock(id: string, quantity: number): Promise<Product>
}
