import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterUserDto {
  @ApiProperty({ description: "Email do usuário" })
  @IsNotEmpty({ message: "O email é obrigatório" })
  @IsEmail({}, { message: "Email inválido" })
  email: string

  @ApiProperty({ description: "Nome do usuário" })
  @IsNotEmpty({ message: "O nome é obrigatório" })
  @IsString({ message: "O nome deve ser uma string" })
  nome: string

  @ApiProperty({ description: "Senha do usuário" })
  @IsNotEmpty({ message: "A senha é obrigatória" })
  @IsString({ message: "A senha deve ser uma string" })
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  senha: string
}
