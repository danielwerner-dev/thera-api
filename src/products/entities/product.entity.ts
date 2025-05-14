import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 100 })
  @Index()
  nome: string

  @Column({ length: 50 })
  @Index()
  categoria: string

  @Column({ type: "text" })
  descricao: string

  @Column("decimal", { precision: 10, scale: 2 })
  preco: number

  @Column()
  quantidade_estoque: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
