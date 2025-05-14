import { Module, type NestModule, type MiddlewareConsumer } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "./config/config.module"
import { ConfigService } from "@nestjs/config"
import { ProductsModule } from "./products/products.module"
import { OrdersModule } from "./orders/orders.module"
import { CommonModule } from "./common/common.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
    }),
    ProductsModule,
    OrdersModule,
    CommonModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
