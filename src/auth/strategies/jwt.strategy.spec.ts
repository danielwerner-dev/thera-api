import { Test, type TestingModule } from "@nestjs/testing"
import { JwtStrategy } from "./jwt.strategy"
import { UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { jest } from "@jest/globals"
import type { IAuthService } from "../interfaces/auth-service.interface"

describe("JwtStrategy", () => {
  let strategy: JwtStrategy
  let mockAuthService: jest.Mocked<IAuthService>
  let mockConfigService: jest.Mocked<ConfigService>

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      validateUser: jest.fn(),
    } as jest.Mocked<IAuthService>

    mockConfigService = {
      get: jest.fn().mockReturnValue("test-secret"),
    } as unknown as jest.Mocked<ConfigService>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: "IAuthService",
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
  })

  it("should be defined", () => {
    expect(strategy).toBeDefined()
  })

  describe("validate", () => {
    it("should return user when token is valid", async () => {
      const payload = { sub: "user-1", email: "test@example.com" }
      const user = { id: payload.sub, email: payload.email }

      mockAuthService.validateUser.mockResolvedValue(user)

      const result = await strategy.validate(payload)

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(payload.sub)
      expect(result).toEqual(user)
    })

    it("should throw UnauthorizedException when user not found", async () => {
      const payload = { sub: "nonexistent-user", email: "test@example.com" }

      mockAuthService.validateUser.mockResolvedValue(null)

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException)
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(payload.sub)
    })
  })
})
