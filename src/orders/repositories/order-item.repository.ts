import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { OrderItem } from "../entities/order-item.entity"
import type { IOrderItemRepository } from "../interfaces/order-item-repository.interface"

@Injectable()
export class OrderItemRepository implements IOrderItemRepository {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  async create(orderItem: OrderItem): Promise<OrderItem> {
    return this.repository.save(orderItem)
  }

  async save(orderItem: OrderItem): Promise<OrderItem> {
    return this.repository.save(orderItem)
  }

  async saveMany(orderItems: OrderItem[]): Promise<OrderItem[]> {
    return this.repository.save(orderItems)
  }
}
