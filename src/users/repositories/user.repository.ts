import type { Repository } from "typeorm"
import type { User } from "../entities/user.entity"
import type { RegisterUserDto } from "../../auth/dto/register-user.dto"
import type { IUserRepository } from "../interfaces/user-repository.interface"

export class UserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<User>) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const user = this.repository.create(registerUserDto)
    return this.repository.save(user)
  }

  async findByEmail(email: string, includeSenha = false): Promise<User | null> {
    const queryBuilder = this.repository.createQueryBuilder("user")
    queryBuilder.where("user.email = :email", { email })

    if (includeSenha) {
      queryBuilder.addSelect("user.senha")
    }

    return queryBuilder.getOne()
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } })
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user)
  }
}
