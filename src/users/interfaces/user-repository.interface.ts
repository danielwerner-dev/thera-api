import type { User } from "../entities/user.entity"
import type { RegisterUserDto } from "../../auth/dto/register-user.dto"

export interface IUserRepository {
  create(registerUserDto: RegisterUserDto): Promise<User>
  findByEmail(email: string, includeSenha?: boolean): Promise<User | null>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<User>
}
