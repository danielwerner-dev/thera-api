import { ApiProperty } from "@nestjs/swagger"
import { OrderStatus } from "../enums/order-status.enum"

class OrderItemResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  productId: string

  @ApiProperty()
  quantidade: number

  @ApiProperty()
  preco_unitario: number

  @ApiProperty()
  subtotal: number

  @ApiProperty()
  product: {
    id: string
    nome: string
  }
}

export class OrderResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[]

  @ApiProperty()
  total_pedido: number

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus

  @ApiProperty()
  created_at: Date
}
