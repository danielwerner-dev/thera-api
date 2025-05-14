import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
} from "typeorm"
import * as bcrypt from "bcrypt"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true, length: 100 })
  @Index({ unique: true })
  email: string

  @Column({ length: 100 })
  nome: string

  @Column({ select: false })
  senha: string

  @Column({ default: false, name: "is_admin" })
  isAdmin: boolean

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @BeforeInsert()
  async hashSenha() {
    if (this.senha) {
      this.senha = await bcrypt.hash(this.senha, 10)
    }
  }

  async validateSenha(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.senha)
  }
}
