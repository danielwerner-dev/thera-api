import type { User } from "../entities/user.entity"
import type { RegisterUserDto } from "../../auth/dto/register-user.dto"

export interface IUsersService {
  create(registerUserDto: RegisterUserDto): Promise<User>
  findByEmail(email: string, includeSenha?: boolean): Promise<User | null>
  findById(id: string): Promise<User>
}
