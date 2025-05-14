import { jest } from "@jest/globals"

// Configuração global para os testes
jest.setTimeout(10000) // 10 segundos

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks()
})
