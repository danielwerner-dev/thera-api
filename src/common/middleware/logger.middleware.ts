import { Injectable, type NestMiddleware } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import type { LoggerService } from "../services/logger.service"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req
    const userAgent = req.get("user-agent") || ""

    // Registra o início da requisição
    this.logger.log(`Requisição recebida - ${method} ${originalUrl} - IP: ${ip} - User Agent: ${userAgent}`, "HTTP")

    // Registra o tempo de início
    const startTime = Date.now()

    // Intercepta o método 'end' do objeto de resposta para registrar quando a resposta for enviada
    const originalEnd = res.end
    res.end = function (this: Response, ...args: any[]) {
      // Calcula o tempo de resposta
      const responseTime = Date.now() - startTime
      const statusCode = res.statusCode

      // Registra informações sobre a resposta
      this.logger.log(
        `Resposta enviada - ${method} ${originalUrl} - Status: ${statusCode} - Tempo: ${responseTime}ms`,
        "HTTP",
      )

      // Chama o método original
      return originalEnd.apply(this, args)
    }.bind(res, this.logger)

    next()
  }
}
