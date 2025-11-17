// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Prisma Client
jest.mock('@prisma/client', () => {
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

  class PrismaClient {
    constructor() {
      return mockPrismaClient
    }
    
    $extends(config) {
      return mockPrismaClient
    }
  }

  return {
    PrismaClient,
    mockPrismaClient,
  }
})

// Mock do módulo prisma.ts
jest.mock('@/app/_lib/prisma', () => {
  const { mockPrismaClient } = jest.requireMock('@prisma/client')
  return {
    db: mockPrismaClient,
  }
})

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

// Mock next-safe-action
jest.mock('next-safe-action', () => ({
  createSafeActionClient: jest.fn(() => ({
    schema: jest.fn(() => ({
      action: jest.fn((handler) => handler),
    })),
  })),
  returnValidationErrors: jest.fn(),
}))

