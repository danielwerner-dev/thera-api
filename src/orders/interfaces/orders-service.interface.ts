import type { Order } from "../entities/order.entity"
import type { CreateOrderDto } from "../dto/create-order.dto"

export interface IOrdersService {
  create(createOrderDto: CreateOrderDto): Promise<Order>
  findAll(): Promise<Order[]>
  findOne(id: string): Promise<Order>
}
