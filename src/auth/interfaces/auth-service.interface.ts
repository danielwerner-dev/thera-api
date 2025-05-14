import type { RegisterUserDto } from "../dto/register-user.dto"
import type { LoginUserDto } from "../dto/login-user.dto"
import type { AuthResponseDto } from "../dto/auth-response.dto"

export interface IAuthService {
  register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto>
  login(loginUserDto: LoginUserDto): Promise<AuthResponseDto>
  validateUser(userId: string): Promise<any>
}
