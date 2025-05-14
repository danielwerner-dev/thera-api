import { Controller, Post, Body } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { RegisterUserDto } from "./dto/register-user.dto"
import type { LoginUserDto } from "./dto/login-user.dto"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { AuthResponseDto } from "./dto/auth-response.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Registrar um novo usuário" })
  @ApiResponse({
    status: 201,
    description: "Usuário registrado com sucesso",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Email já cadastrado" })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Autenticar usuário" })
  @ApiResponse({
    status: 200,
    description: "Usuário autenticado com sucesso",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
