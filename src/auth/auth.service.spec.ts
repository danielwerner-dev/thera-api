import { Test, type TestingModule } from "@nestjs/testing"
import { AuthService } from "./services/auth.service"
import { JwtService } from "@nestjs/jwt"
import { UnauthorizedException } from "@nestjs/common"
import type { User } from "../users/entities/user.entity"
import { jest } from "@jest/globals"
import type { IUsersService } from "../users/interfaces/users-service.interface"

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockImplementation((senha, hash) => Promise.resolve(senha === "password123")),
}))

describe("AuthService", () => {
  let service: AuthService
  let mockUsersService: jest.Mocked<IUsersService>
  let jwtService: JwtService

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IUsersService>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: "IUsersService",
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("test-token"),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("register", () => {
    it("should register a new user and return token", async () => {
      const registerDto = {
        email: "test@example.com",
        nome: "Test User",
        senha: "password123",
      }

      const createdUser = {
        id: "user-1",
        email: registerDto.email,
        nome: registerDto.nome,
        isAdmin: false,
      } as User

      mockUsersService.create.mockResolvedValue(createdUser)

      const result = await service.register(registerDto)

      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto)
      expect(result).toEqual({
        user: {
          id: createdUser.id,
          email: createdUser.email,
          nome: createdUser.nome,
          isAdmin: createdUser.isAdmin,
        },
        access_token: "test-token",
      })
    })
  })

  describe("login", () => {
    it("should return token when credentials are valid", async () => {
      const loginDto = {
        email: "test@example.com",
        senha: "password123",
      }

      const user = {
        id: "user-1",
        email: loginDto.email,
        nome: "Test User",
        isAdmin: false,
        senha: "hashed-password",
        validateSenha: jest.fn().mockResolvedValue(true),
      } as unknown as User

      mockUsersService.findByEmail.mockResolvedValue(user)

      const result = await service.login(loginDto)

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email, true)
      expect(user.validateSenha).toHaveBeenCalledWith(loginDto.senha)
      expect(result).toEqual({
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          isAdmin: user.isAdmin,
        },
        access_token: "test-token",
      })
    })

    it("should throw UnauthorizedException when user not found", async () => {
      const loginDto = {
        email: "nonexistent@example.com",
        senha: "password123",
      }

      mockUsersService.findByEmail.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email, true)
    })

    it("should throw UnauthorizedException when password is invalid", async () => {
      const loginDto = {
        email: "test@example.com",
        senha: "wrong-password",
      }

      const user = {
        id: "user-1",
        email: loginDto.email,
        validateSenha: jest.fn().mockResolvedValue(false),
      } as unknown as User

      mockUsersService.findByEmail.mockResolvedValue(user)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(user.validateSenha).toHaveBeenCalledWith(loginDto.senha)
    })
  })

  describe("validateUser", () => {
    it("should return user when user exists", async () => {
      const userId = "user-1"
      const user = { id: userId, email: "test@example.com" } as User

      mockUsersService.findById.mockResolvedValue(user)

      const result = await service.validateUser(userId)

      expect(mockUsersService.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(user)
    })
  })
})
