import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { upsertSaleAction } from '../upsert-sale'
import { db } from '@/app/_lib/prisma'
import { revalidatePath } from 'next/cache'
import { returnValidationErrors } from 'next-safe-action'

describe('upsertSaleAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve criar uma nova venda com sucesso', async () => {
    const saleData = {
      products: [
        {
          id: 'product-1',
          quantity: 2,
        },
      ],
    }

    const mockProduct = {
      id: 'product-1',
      name: 'Produto 1',
      price: 10.5,
      stock: 10,
    }

    const mockSale = {
      id: 'sale-1',
      date: new Date(),
    }

    const trx = {
      sale: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue(mockSale),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn().mockResolvedValue(mockProduct),
        update: jest.fn(),
      },
      saleProduct: {
        create: jest.fn(),
      },
    }

    ;(db.$transaction as jest.Mock).mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return await callback(trx)
      }
      return Promise.resolve()
    })

    await upsertSaleAction({ parsedInput: saleData })

    expect(trx.sale.create).toHaveBeenCalled()
    expect(trx.product.findUnique).toHaveBeenCalledWith({
      where: { id: 'product-1' },
    })
    expect(trx.saleProduct.create).toHaveBeenCalled()
    expect(trx.product.update).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      data: {
        stock: {
          decrement: 2,
        },
      },
    })
    expect(revalidatePath).toHaveBeenCalledWith('/products')
    expect(revalidatePath).toHaveBeenCalledWith('/sales')
  })

  it('deve retornar erro quando produto não é encontrado', async () => {
    const saleData = {
      products: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1,
        },
      ],
    }

    const trx = {
      sale: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'sale-1', date: new Date() }),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
      },
      saleProduct: {
        create: jest.fn(),
      },
    }

    // Mock returnValidationErrors para lançar um erro
    ;(returnValidationErrors as jest.Mock).mockImplementation(() => {
      throw new Error('Validation error')
    })

    ;(db.$transaction as jest.Mock).mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        try {
          return await callback(trx)
        } catch (error) {
          // Capturar o erro de validação
          return
        }
      }
      return Promise.resolve()
    })

    await upsertSaleAction({ parsedInput: saleData })

    expect(returnValidationErrors).toHaveBeenCalledWith(
      expect.anything(),
      { _errors: ['Produto não encontrado'] }
    )
    expect(trx.saleProduct.create).not.toHaveBeenCalled()
  })

  it('deve retornar erro quando estoque é insuficiente', async () => {
    const saleData = {
      products: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 10, // Mais do que o estoque disponível
        },
      ],
    }

    const mockProduct = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Produto 1',
      price: 10.5,
      stock: 5, // Estoque menor que a quantidade solicitada
    }

    const trx = {
      sale: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'sale-1', date: new Date() }),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn().mockResolvedValue(mockProduct),
        update: jest.fn(),
      },
      saleProduct: {
        create: jest.fn(),
      },
    }

    // Mock returnValidationErrors para lançar um erro
    ;(returnValidationErrors as jest.Mock).mockImplementation(() => {
      throw new Error('Validation error')
    })

    ;(db.$transaction as jest.Mock).mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        try {
          return await callback(trx)
        } catch (error) {
          // Capturar o erro de validação
          return
        }
      }
      return Promise.resolve()
    })

    await upsertSaleAction({ parsedInput: saleData })

    expect(returnValidationErrors).toHaveBeenCalledWith(
      expect.anything(),
      { _errors: ['Estoque insuficiente'] }
    )
    expect(trx.saleProduct.create).not.toHaveBeenCalled()
  })

  it('deve atualizar uma venda existente e restaurar estoque', async () => {
    const saleData = {
      id: 'existing-sale-id',
      products: [
        {
          id: 'product-1',
          quantity: 3,
        },
      ],
    }

    const existingSale = {
      id: 'existing-sale-id',
      date: new Date('2024-01-01'),
      saleProducts: [
        {
          id: 'sp1',
          productId: 'product-1',
          quantity: 2,
        },
      ],
    }

    const mockProduct = {
      id: 'product-1',
      name: 'Produto 1',
      price: 10.5,
      stock: 10,
    }

    const trx = {
      sale: {
        findUnique: jest.fn().mockResolvedValue(existingSale),
        create: jest.fn().mockResolvedValue({ id: 'sale-1', date: existingSale.date }),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn().mockResolvedValue(mockProduct),
        update: jest.fn(),
      },
      saleProduct: {
        create: jest.fn(),
      },
    }

    ;(db.$transaction as jest.Mock).mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return await callback(trx)
      }
      return Promise.resolve()
    })

    await upsertSaleAction({ parsedInput: saleData })

    // Deve restaurar o estoque da venda antiga
    expect(trx.product.update).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      data: {
        stock: {
          increment: 2, // Restaurar quantidade da venda antiga
        },
      },
    })

    // Deve deletar a venda antiga
    expect(trx.sale.delete).toHaveBeenCalledWith({
      where: { id: 'existing-sale-id' },
    })

    // Deve criar nova venda com a data original
    expect(trx.sale.create).toHaveBeenCalledWith({
      data: {
        date: existingSale.date,
      },
    })
  })

  it('deve processar múltiplos produtos em uma venda', async () => {
    const saleData = {
      products: [
        {
          id: 'product-1',
          quantity: 2,
        },
        {
          id: 'product-2',
          quantity: 1,
        },
      ],
    }

    const mockProducts = [
      {
        id: 'product-1',
        name: 'Produto 1',
        price: 10.5,
        stock: 10,
      },
      {
        id: 'product-2',
        name: 'Produto 2',
        price: 20.0,
        stock: 5,
      },
    ]

    const trx = {
      sale: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'sale-1', date: new Date() }),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn()
          .mockResolvedValueOnce(mockProducts[0])
          .mockResolvedValueOnce(mockProducts[1]),
        update: jest.fn(),
      },
      saleProduct: {
        create: jest.fn(),
      },
    }

    ;(db.$transaction as jest.Mock).mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return await callback(trx)
      }
      return Promise.resolve()
    })

    await upsertSaleAction({ parsedInput: saleData })

    expect(trx.product.findUnique).toHaveBeenCalledTimes(2)
    expect(trx.saleProduct.create).toHaveBeenCalledTimes(2)
    expect(trx.product.update).toHaveBeenCalledTimes(2)
  })
})

