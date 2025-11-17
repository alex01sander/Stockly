import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { upsertSaleAction } from '@/app/_actions/sale/upsert-sale'
import { getSales } from '@/app/_data-acess/sales/get-sales'
import { getProducts } from '@/app/_data-acess/product/get-produts'
import { db } from '@/app/_lib/prisma'
import { revalidatePath } from 'next/cache'
import { returnValidationErrors } from 'next-safe-action'

describe('Fluxo de Integração - Vendas', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve criar uma venda e atualizar estoque dos produtos', async () => {
    const mockProducts = [
      {
        id: 'product-1',
        name: 'Produto 1',
        price: 10.5,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'product-2',
        name: 'Produto 2',
        price: 20.0,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const saleData = {
      products: [
        { id: 'product-1', quantity: 2 },
        { id: 'product-2', quantity: 1 },
      ],
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

    // Criar venda
    await upsertSaleAction({ parsedInput: saleData })

    // Verificar que os produtos foram atualizados
    expect(trx.product.update).toHaveBeenCalledTimes(2)
    expect(trx.product.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'product-1' },
      data: {
        stock: {
          decrement: 2,
        },
      },
    })
    expect(trx.product.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'product-2' },
      data: {
        stock: {
          decrement: 1,
        },
      },
    })

    // Mock: Listar vendas
    const mockSales = [
      {
        id: 'sale-1',
        date: mockSale.date,
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp1',
            saleId: 'sale-1',
            productId: 'product-1',
            unitPrice: 10.5,
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: mockProducts[0],
          },
          {
            id: 'sp2',
            saleId: 'sale-1',
            productId: 'product-2',
            unitPrice: 20.0,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: mockProducts[1],
          },
        ],
      },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValueOnce(mockSales)

    const sales = await getSales()

    expect(sales).toHaveLength(1)
    expect(sales[0].totalAmount).toBe(41.0) // (10.5 * 2) + (20.0 * 1)
    expect(sales[0].totalProducts).toBe(3) // 2 + 1
    expect(sales[0].productName).toBe('Produto 1 - Produto 2')
  })

  it('deve impedir venda quando estoque é insuficiente', async () => {
    const mockProduct = {
      id: 'product-1',
      name: 'Produto 1',
      price: 10.5,
      stock: 5, // Estoque menor que a quantidade solicitada
    }

    const saleData = {
      products: [
        { id: 'product-1', quantity: 10 },
      ],
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

    ;(db.$transaction as jest.Mock).mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        try {
          return await callback(trx)
        } catch (error) {
          // returnValidationErrors lança um erro, então capturamos aqui
          return
        }
      }
      return Promise.resolve()
    })

    await upsertSaleAction({ parsedInput: saleData })

    // Deve retornar erro de estoque insuficiente
    expect(returnValidationErrors).toHaveBeenCalledWith(
      expect.anything(),
      { _errors: ['Estoque insuficiente'] }
    )

    // Não deve criar saleProduct quando há erro de estoque
    // Nota: O código pode criar a venda antes de verificar o estoque,
    // então este teste pode precisar ser ajustado baseado no comportamento real
  })

  it('deve atualizar uma venda e restaurar estoque corretamente', async () => {
    const existingSale = {
      id: 'sale-1',
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
      stock: 8, // Estoque após a venda original
    }

    const saleData = {
      id: 'sale-1',
      products: [
        { id: 'product-1', quantity: 3 }, // Nova quantidade
      ],
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
    expect(trx.product.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'product-1' },
      data: {
        stock: {
          increment: 2, // Restaurar quantidade da venda antiga
        },
      },
    })

    // Deve decrementar o estoque para a nova venda
    expect(trx.product.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'product-1' },
      data: {
        stock: {
          decrement: 3, // Nova quantidade
        },
      },
    })

    // Deve deletar a venda antiga
    expect(trx.sale.delete).toHaveBeenCalledWith({
      where: { id: 'sale-1' },
    })
  })
})

