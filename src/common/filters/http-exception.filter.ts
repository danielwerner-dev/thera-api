import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common"
import type { Request, Response } from "express"
import type { LoggerService } from "../services/logger.service"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException ? exception.getResponse() : { message: "Erro interno do servidor" }

    // Registrar o erro
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - ${
        typeof message === "object" ? JSON.stringify(message) : message
      }`,
      exception instanceof Error ? exception.stack : undefined,
      "ExceptionFilter",
    )

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof message === "object" ? message : { message }),
    })
  }
}
