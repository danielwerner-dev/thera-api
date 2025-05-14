import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { OrdersController } from "./controllers/orders.controller"
import { OrdersService } from "./services/orders.service"
import { OrderRepository } from "./repositories/order.repository"
import { OrderItemRepository } from "./repositories/order-item.repository"
import { Order } from "./entities/order.entity"
import { OrderItem } from "./entities/order-item.entity"
import { ProductsModule } from "../products/products.module"

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductsModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: "IOrderRepository",
      useClass: OrderRepository,
    },
    {
      provide: "IOrderItemRepository",
      useClass: OrderItemRepository,
    },
    {
      provide: "IOrdersService",
      useClass: OrdersService,
    },
  ],
  exports: ["IOrdersService"],
})
export class OrdersModule {}
