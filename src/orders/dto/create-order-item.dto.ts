import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateOrderItemDto {
  @ApiProperty({ description: "ID do produto" })
  @IsNotEmpty({ message: "O ID do produto é obrigatório" })
  @IsUUID("4", { message: "ID do produto inválido" })
  productId: string

  @ApiProperty({ description: "Quantidade do produto" })
  @IsNotEmpty({ message: "A quantidade é obrigatória" })
  @IsNumber({}, { message: "A quantidade deve ser um número" })
  @IsPositive({ message: "A quantidade deve ser positiva" })
  @Min(1, { message: "A quantidade mínima é 1" })
  quantidade: number
}
