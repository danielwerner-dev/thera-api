import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"
import { OrderItem } from "./order-item.entity"
import { OrderStatus } from "../enums/order-status.enum"

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @OneToMany(
    () => OrderItem,
    (item) => item.order,
    { cascade: true, eager: true },
  )
  items: OrderItem[]

  @Column("decimal", { precision: 10, scale: 2, name: "total_pedido" })
  total_pedido: number

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDENTE,
  })
  @Index()
  status: OrderStatus

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
