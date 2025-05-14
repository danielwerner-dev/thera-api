import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProductsController } from "./controllers/products.controller"
import { ProductsService } from "./services/products.service"
import { ProductRepository } from "./repositories/product.repository"
import { Product } from "./entities/product.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    {
      provide: "IProductRepository",
      useClass: ProductRepository,
    },
    {
      provide: "IProductsService",
      useClass: ProductsService,
    },
  ],
  exports: ["IProductRepository", "IProductsService"],
})
export class ProductsModule {}
