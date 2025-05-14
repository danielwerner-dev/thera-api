import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginUserDto {
  @ApiProperty({ description: "Email do usuário" })
  @IsNotEmpty({ message: "O email é obrigatório" })
  @IsEmail({}, { message: "Email inválido" })
  email: string

  @ApiProperty({ description: "Senha do usuário" })
  @IsNotEmpty({ message: "A senha é obrigatória" })
  @IsString({ message: "A senha deve ser uma string" })
  senha: string
}
