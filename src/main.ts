import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { LoggerService } from "./common/services/logger.service"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  // Usar o serviço de logger personalizado
  const logger = app.get(LoggerService)
  app.useLogger(logger) // Use the logger instance directly

  // Registrar o interceptor de logging
  app.useGlobalInterceptors(new LoggingInterceptor(logger))

  // Registrar o filtro de exceções
  app.useGlobalFilters(new HttpExceptionFilter(logger))

  // Configuração global de pipes para validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("Produtos API")
    .setDescription("API para gerenciamento de produtos e pedidos")
    .setVersion("1.0")
    .addTag("produtos")
    .addTag("pedidos")
    .addTag("auth")
    .addBearerAuth() // Adiciona autenticação Bearer no Swagger
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  await app.listen(3000)
  logger.log(`Aplicação rodando na porta 3000`, "Bootstrap")
}
bootstrap()
