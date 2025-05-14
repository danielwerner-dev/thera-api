import type { Product } from "../entities/product.entity"
import type { CreateProductDto } from "../dto/create-product.dto"
import type { UpdateProductDto } from "../dto/update-product.dto"

export interface IProductsService {
  create(createProductDto: CreateProductDto): Promise<Product>
  findAll(): Promise<Product[]>
  findOne(id: string): Promise<Product>
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>
  remove(id: string): Promise<void>
}
