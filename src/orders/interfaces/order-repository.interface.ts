import type { Order } from "../entities/order.entity"

export interface IOrderRepository {
  create(order: Order): Promise<Order>
  findAll(): Promise<Order[]>
  findOne(id: string): Promise<Order | null>
  save(order: Order): Promise<Order>
}
