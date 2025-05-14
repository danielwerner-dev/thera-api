import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { CreateOrderItemDto } from "./create-order-item.dto"

export class CreateOrderDto {
  @ApiProperty({
    description: "Itens do pedido",
    type: [CreateOrderItemDto],
  })
  @IsNotEmpty({ message: "Os itens do pedido são obrigatórios" })
  @IsArray({ message: "Os itens do pedido devem ser um array" })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]
}
