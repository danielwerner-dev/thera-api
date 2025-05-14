import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import type { User } from "../entities/user.entity"
import type { RegisterUserDto } from "../../auth/dto/register-user.dto"
import type { IUsersService } from "../interfaces/users-service.interface"
import type { IUserRepository } from "../interfaces/user-repository.interface"
import { Inject } from "@nestjs/common"

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { email } = registerUserDto

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new ConflictException(`Usuário com email ${email} já existe`)
    }

    return this.userRepository.create(registerUserDto)
  }

  async findByEmail(email: string, includeSenha = false): Promise<User | null> {
    return this.userRepository.findByEmail(email, includeSenha)
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`)
    }
    return user
  }
}
