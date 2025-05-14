import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateProductDto {
  @ApiProperty({ description: "Nome do produto" })
  @IsNotEmpty({ message: "O nome é obrigatório" })
  @IsString({ message: "O nome deve ser uma string" })
  nome: string

  @ApiProperty({ description: "Categoria do produto" })
  @IsNotEmpty({ message: "A categoria é obrigatória" })
  @IsString({ message: "A categoria deve ser uma string" })
  categoria: string

  @ApiProperty({ description: "Descrição do produto" })
  @IsNotEmpty({ message: "A descrição é obrigatória" })
  @IsString({ message: "A descrição deve ser uma string" })
  descricao: string

  @ApiProperty({ description: "Preço do produto" })
  @IsNotEmpty({ message: "O preço é obrigatório" })
  @IsNumber({}, { message: "O preço deve ser um número" })
  @IsPositive({ message: "O preço deve ser positivo" })
  preco: number

  @ApiProperty({ description: "Quantidade em estoque" })
  @IsNotEmpty({ message: "A quantidade em estoque é obrigatória" })
  @IsNumber({}, { message: "A quantidade em estoque deve ser um número" })
  @Min(0, { message: "A quantidade em estoque não pode ser negativa" })
  quantidade_estoque: number
}
