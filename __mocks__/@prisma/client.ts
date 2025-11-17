// Mock do Prisma Client para testes
const { jest } = require('@jest/globals')

const mockPrismaClient = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  },
  sale: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  saleProduct: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn((callback) => {
    if (typeof callback === 'function') {
      return callback(mockPrismaClient)
    }
    return Promise.resolve()
  }),
  $extends: jest.fn((config) => mockPrismaClient),
}

// Mock do PrismaClient como uma classe
class PrismaClient {
  constructor() {
    return mockPrismaClient
  }
  
  $extends(config) {
    return mockPrismaClient
  }
}

module.exports = {
  PrismaClient,
  mockPrismaClient,
}

