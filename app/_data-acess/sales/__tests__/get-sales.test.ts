import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { getSales } from '../get-sales'
import { db } from '@/app/_lib/prisma'

describe('getSales', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve retornar vendas formatadas corretamente', async () => {
    const mockSales = [
      {
        id: '1',
        date: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp1',
            saleId: '1',
            productId: 'p1',
            unitPrice: 10.5,
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: {
              id: 'p1',
              name: 'Produto 1',
              price: 10.5,
              stock: 8,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            id: 'sp2',
            saleId: '1',
            productId: 'p2',
            unitPrice: 20.0,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: {
              id: 'p2',
              name: 'Produto 2',
              price: 20.0,
              stock: 9,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValue(mockSales)

    const result = await getSales()

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: '1',
      productName: 'Produto 1 - Produto 2',
      totalProducts: 3, // 2 + 1
      totalAmount: 41.0, // (10.5 * 2) + (20.0 * 1)
      date: mockSales[0].date,
    })
    expect(result[0].saleProducts).toHaveLength(2)
  })

  it('deve calcular totalAmount corretamente para múltiplas vendas', async () => {
    const mockSales = [
      {
        id: '1',
        date: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp1',
            saleId: '1',
            productId: 'p1',
            unitPrice: 15.0,
            quantity: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: {
              id: 'p1',
              name: 'Produto 1',
              price: 15.0,
              stock: 7,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValue(mockSales)

    const result = await getSales()

    expect(result[0].totalAmount).toBe(45.0) // 15.0 * 3
    expect(result[0].totalProducts).toBe(3)
  })

  it('deve retornar array vazio quando não há vendas', async () => {
    ;(db.sale.findMany as jest.Mock).mockResolvedValue([])

    const result = await getSales()

    expect(result).toEqual([])
  })

  it('deve lidar com vendas sem produtos', async () => {
    const mockSales = [
      {
        id: '1',
        date: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [],
      },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValue(mockSales)

    const result = await getSales()

    expect(result[0].totalAmount).toBe(0)
    expect(result[0].totalProducts).toBe(0)
    expect(result[0].productName).toBe('')
  })

  it('deve lidar com erros do banco de dados', async () => {
    const error = new Error('Erro ao buscar vendas')
    ;(db.sale.findMany as jest.Mock).mockRejectedValue(error)

    await expect(getSales()).rejects.toThrow('Erro ao buscar vendas')
  })
})

