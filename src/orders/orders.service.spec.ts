import { Test, type TestingModule } from "@nestjs/testing"
import { OrdersService } from "./services/orders.service"
import { DataSource } from "typeorm"
import { NotFoundException } from "@nestjs/common"
import { OrderStatus } from "./enums/order-status.enum"
import { jest } from "@jest/globals"
import type { IOrderRepository } from "./interfaces/order-repository.interface"
import type { IProductRepository } from "../products/interfaces/product-repository.interface"
import type { Order } from "./entities/order.entity"

describe("OrdersService", () => {
  let service: OrdersService
  let mockOrderRepository: jest.Mocked<IOrderRepository>
  let mockProductRepository: jest.Mocked<IProductRepository>
  let mockDataSource: any
  let mockQueryRunner: any

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setLock: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      },
    }

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    }

    mockOrderRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<IOrderRepository>

    mockProductRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIds: jest.fn(),
      decreaseStock: jest.fn(),
    } as jest.Mocked<IProductRepository>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: "IOrderRepository",
          useValue: mockOrderRepository,
        },
        {
          provide: "IProductRepository",
          useValue: mockProductRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("findAll", () => {
    it("should return an array of orders", async () => {
      const expectedOrders = [
        { id: "1", status: OrderStatus.PENDENTE },
        { id: "2", status: OrderStatus.CONCLUIDO },
      ] as Order[]

      mockOrderRepository.findAll.mockResolvedValue(expectedOrders)

      const orders = await service.findAll()
      expect(orders).toEqual(expectedOrders)
      expect(mockOrderRepository.findAll).toHaveBeenCalled()
    })
  })

  describe("findOne", () => {
    it("should return an order by id", async () => {
      const expectedOrder = {
        id: "1",
        status: OrderStatus.PENDENTE,
        items: [{ id: "item-1", product: { id: "prod-1", nome: "Produto 1" } }],
      } as unknown as Order

      mockOrderRepository.findOne.mockResolvedValue(expectedOrder)

      const order = await service.findOne("1")
      expect(order).toEqual(expectedOrder)
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith("1")
    })

    it("should throw NotFoundException if order not found", async () => {
      mockOrderRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException)
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith("1")
    })
  })

  // O teste do método create é mais complexo devido às transações
  // e será implementado em uma etapa posterior
})
