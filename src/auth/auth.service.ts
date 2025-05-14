import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UsersService } from "../users/users.service"
import type { RegisterUserDto } from "./dto/register-user.dto"
import type { LoginUserDto } from "./dto/login-user.dto"
import type { AuthResponseDto } from "./dto/auth-response.dto"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(registerUserDto)

    const payload = { sub: user.id, email: user.email }
    const access_token = this.jwtService.sign(payload)

    return {
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        isAdmin: user.isAdmin,
      },
      access_token,
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, senha } = loginUserDto

    // Buscar usuário com senha (normalmente excluída das consultas)
    const user = await this.usersService.findByEmail(email, true)
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas")
    }

    // Validar senha
    const isPasswordValid = await user.validateSenha(senha)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas")
    }

    const payload = { sub: user.id, email: user.email }
    const access_token = this.jwtService.sign(payload)

    return {
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        isAdmin: user.isAdmin,
      },
      access_token,
    }
  }

  async validateUser(userId: string): Promise<any> {
    return this.usersService.findById(userId)
  }
}
