import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { Order } from "./order.entity"
import { Product } from "../../products/entities/product.entity"

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => Order,
    (order) => order.items,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product

  @Column({ name: "product_id" })
  productId: string

  @Column()
  quantidade: number

  @Column("decimal", { precision: 10, scale: 2, name: "preco_unitario" })
  preco_unitario: number

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
