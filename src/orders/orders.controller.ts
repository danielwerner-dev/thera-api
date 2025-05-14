import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common"
import type { OrdersService } from "./orders.service"
import type { CreateOrderDto } from "./dto/create-order.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger"
import { OrderResponseDto } from "./dto/order-response.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import type { User } from "../users/entities/user.entity"

@ApiTags("pedidos")
@Controller("pedidos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo pedido" })
  @ApiResponse({
    status: 201,
    description: "Pedido criado com sucesso",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos ou estoque insuficiente" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create(createOrderDto)
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os pedidos" })
  @ApiResponse({
    status: 200,
    description: "Lista de pedidos retornada com sucesso",
    type: [OrderResponseDto],
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll()
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um pedido pelo ID" })
  @ApiParam({ name: "id", description: "ID do pedido" })
  @ApiResponse({
    status: 200,
    description: "Pedido encontrado com sucesso",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: "Pedido não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  findOne(@Param("id") id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id)
  }
}
