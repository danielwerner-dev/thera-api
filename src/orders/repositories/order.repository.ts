import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Order } from "../entities/order.entity"
import type { IOrderRepository } from "../interfaces/order-repository.interface"

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) { }

  async create(order: Order): Promise<Order> {
    return this.repository.save(order)
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ["items", "items.product"],
    })
  }

  async findOne(id: string): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["items", "items.product"],
    })
  }

  async save(order: Order): Promise<Order> {
    return this.repository.save(order)
  }
}
