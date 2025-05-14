import { LoggerMiddleware } from "./logger.middleware"
import type { LoggerService } from "../services/logger.service"
import { jest } from "@jest/globals"

describe("LoggerMiddleware", () => {
  let middleware: LoggerMiddleware
  let loggerService: LoggerService
  let req: any
  let res: any
  let next: jest.Mock

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as LoggerService

    middleware = new LoggerMiddleware(loggerService)

    req = {
      method: "GET",
      originalUrl: "/test",
      ip: "127.0.0.1",
      get: jest.fn().mockReturnValue("test-user-agent"),
    }

    res = {
      statusCode: 200,
      end: jest.fn(),
    }

    next = jest.fn()

    // Mock Date.now to return consistent values for testing
    jest.spyOn(Date, "now").mockImplementation(() => 1000)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should log request information", () => {
    middleware.use(req, res, next)

    expect(loggerService.log).toHaveBeenCalledWith(expect.stringContaining("Requisição recebida - GET /test"), "HTTP")
    expect(next).toHaveBeenCalled()
  })

  it("should log response information when response ends", () => {
    middleware.use(req, res, next)

    // Simulate response end
    const endCallback = res.end
    endCallback()

    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining("Resposta enviada - GET /test - Status: 200"),
      "HTTP",
    )
  })

  it("should calculate response time correctly", () => {
    // First call to Date.now returns 1000
    middleware.use(req, res, next)

    // Second call to Date.now returns 1500 (500ms later)
    jest.spyOn(Date, "now").mockImplementation(() => 1500)

    // Simulate response end
    const endCallback = res.end
    endCallback()

    expect(loggerService.log).toHaveBeenCalledWith(expect.stringContaining("Tempo: 500ms"), "HTTP")
  })

  it("should preserve the original end function behavior", () => {
    const originalEnd = res.end
    middleware.use(req, res, next)

    // Simulate response end with arguments
    const args = ["test-response"]
    res.end(...args)

    expect(originalEnd).toHaveBeenCalledWith(...args)
  })
})
