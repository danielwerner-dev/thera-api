import { Test, type TestingModule } from "@nestjs/testing"
import { ProductsService } from "./services/products.service"
import type { Product } from "./entities/product.entity"
import { NotFoundException } from "@nestjs/common"
import { jest } from "@jest/globals"
import type { IProductRepository } from "./interfaces/product-repository.interface"

describe("ProductsService", () => {
  let service: ProductsService
  let mockProductRepository: jest.Mocked<IProductRepository>

  beforeEach(async () => {
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
        ProductsService,
        {
          provide: "IProductRepository",
          useValue: mockProductRepository,
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a new product", async () => {
      const createProductDto = {
        nome: "Produto Teste",
        categoria: "Categoria Teste",
        descricao: "Descrição Teste",
        preco: 100,
        quantidade_estoque: 10,
      }

      const product = { id: "1", ...createProductDto } as Product

      mockProductRepository.create.mockResolvedValue(product)

      const result = await service.create(createProductDto)

      expect(mockProductRepository.create).toHaveBeenCalledWith(createProductDto)
      expect(result).toEqual(product)
    })
  })

  describe("findAll", () => {
    it("should return an array of products", async () => {
      const expectedProducts = [
        { id: "1", nome: "Produto 1" },
        { id: "2", nome: "Produto 2" },
      ] as Product[]

      mockProductRepository.findAll.mockResolvedValue(expectedProducts)

      const products = await service.findAll()
      expect(products).toEqual(expectedProducts)
      expect(mockProductRepository.findAll).toHaveBeenCalled()
    })
  })

  describe("findOne", () => {
    it("should return a product by id", async () => {
      const expectedProduct = { id: "1", nome: "Produto Teste" } as Product
      mockProductRepository.findOne.mockResolvedValue(expectedProduct)

      const product = await service.findOne("1")
      expect(product).toEqual(expectedProduct)
      expect(mockProductRepository.findOne).toHaveBeenCalledWith("1")
    })

    it("should throw NotFoundException if product not found", async () => {
      mockProductRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException)
      expect(mockProductRepository.findOne).toHaveBeenCalledWith("1")
    })
  })

  describe("update", () => {
    it("should update a product", async () => {
      const updateProductDto = { nome: "Produto Atualizado" }
      const updatedProduct = {
        id: "1",
        nome: "Produto Atualizado",
        categoria: "Categoria",
        descricao: "Descrição",
        preco: 100,
        quantidade_estoque: 10,
      } as Product

      mockProductRepository.update.mockResolvedValue(updatedProduct)

      const result = await service.update("1", updateProductDto)

      expect(mockProductRepository.update).toHaveBeenCalledWith("1", updateProductDto)
      expect(result).toEqual(updatedProduct)
    })
  })

  describe("remove", () => {
    it("should remove a product", async () => {
      mockProductRepository.remove.mockResolvedValue(undefined)

      await service.remove("1")

      expect(mockProductRepository.remove).toHaveBeenCalledWith("1")
    })
  })
})
