import { Injectable, type LoggerService as NestLoggerService } from "@nestjs/common"

@Injectable()
export class LoggerService implements NestLoggerService {
  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(message: any, context?: string): string {
    return `[${context || "Application"}] ${message}`
  }

  log(message: any, context?: string): void {
    const formattedMessage = this.formatMessage(message, context)
    console.log(`${this.getTimestamp()} [INFO] ${formattedMessage}`)
  }

  error(message: any, trace?: string, context?: string): void {
    const formattedMessage = this.formatMessage(message, context)
    console.error(`${this.getTimestamp()} [ERROR] ${formattedMessage}`)
    if (trace) {
      console.error(trace)
    }
  }

  warn(message: any, context?: string): void {
    const formattedMessage = this.formatMessage(message, context)
    console.warn(`${this.getTimestamp()} [WARN] ${formattedMessage}`)
  }

  debug(message: any, context?: string): void {
    const formattedMessage = this.formatMessage(message, context)
    console.debug(`${this.getTimestamp()} [DEBUG] ${formattedMessage}`)
  }

  verbose(message: any, context?: string): void {
    const formattedMessage = this.formatMessage(message, context)
    console.log(`${this.getTimestamp()} [VERBOSE] ${formattedMessage}`)
  }
}
