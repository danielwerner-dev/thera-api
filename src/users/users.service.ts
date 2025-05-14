import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import type { RegisterUserDto } from "../auth/dto/register-user.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { email } = registerUserDto

    // Verificar se o usuário já existe
    const existingUser = await this.usersRepository.findOne({ where: { email } })
    if (existingUser) {
      throw new ConflictException(`Usuário com email ${email} já existe`)
    }

    const user = this.usersRepository.create(registerUserDto)
    return this.usersRepository.save(user)
  }

  async findByEmail(email: string, includeSenha = false): Promise<User | null> {
    const queryBuilder = this.usersRepository.createQueryBuilder("user")
    queryBuilder.where("user.email = :email", { email })

    if (includeSenha) {
      queryBuilder.addSelect("user.senha")
    }

    return queryBuilder.getOne()
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`)
    }
    return user
  }
}
