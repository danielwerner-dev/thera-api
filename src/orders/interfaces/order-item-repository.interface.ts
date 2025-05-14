import type { OrderItem } from "../entities/order-item.entity"

export interface IOrderItemRepository {
  create(orderItem: OrderItem): Promise<OrderItem>
  save(orderItem: OrderItem): Promise<OrderItem>
  saveMany(orderItems: OrderItem[]): Promise<OrderItem[]>
}
