import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { getDashboardStats } from '../get-dashboard-stats'
import { db } from '@/app/_lib/prisma'

describe('getDashboardStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Resetar Date.now para testes consistentes
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('deve calcular estatísticas corretamente', async () => {
    const mockSales = [
      {
        id: '1',
        date: new Date('2024-01-15T10:00:00Z'), // Hoje
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp1',
            unitPrice: 10.5,
            quantity: 2,
          },
          {
            id: 'sp2',
            unitPrice: 20.0,
            quantity: 1,
          },
        ],
      },
      {
        id: '2',
        date: new Date('2024-01-14T10:00:00Z'), // Ontem
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp3',
            unitPrice: 15.0,
            quantity: 3,
          },
        ],
      },
    ]

    const mockProducts = [
      { stock: 10 },
      { stock: 5 },
      { stock: 3 },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValue(mockSales)
    ;(db.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const result = await getDashboardStats()

    // Receita total: (10.5 * 2) + (20.0 * 1) + (15.0 * 3) = 21 + 20 + 45 = 86
    expect(result.totalRevenue).toBe(86)
    // Receita hoje: (10.5 * 2) + (20.0 * 1) = 41
    expect(result.todayRevenue).toBe(41)
    // Total de vendas: 2
    expect(result.totalSales).toBe(2)
    // Total em estoque: 10 + 5 + 3 = 18
    expect(result.totalStock).toBe(18)
    // Total de produtos: 3
    expect(result.totalProducts).toBe(3)
  })

  it('deve calcular receita de hoje corretamente', async () => {
    const today = new Date('2024-01-15T12:00:00Z')
    const yesterday = new Date('2024-01-14T12:00:00Z')

    const mockSales = [
      {
        id: '1',
        date: today,
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp1',
            unitPrice: 10.0,
            quantity: 2,
          },
        ],
      },
      {
        id: '2',
        date: yesterday,
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [
          {
            id: 'sp2',
            unitPrice: 20.0,
            quantity: 1,
          },
        ],
      },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValue(mockSales)
    ;(db.product.findMany as jest.Mock).mockResolvedValue([])

    const result = await getDashboardStats()

    // Apenas a venda de hoje deve ser contabilizada
    expect(result.todayRevenue).toBe(20.0) // 10.0 * 2
    expect(result.totalRevenue).toBe(40.0) // (10.0 * 2) + (20.0 * 1)
  })

  it('deve retornar zeros quando não há dados', async () => {
    ;(db.sale.findMany as jest.Mock).mockResolvedValue([])
    ;(db.product.findMany as jest.Mock).mockResolvedValue([])

    const result = await getDashboardStats()

    expect(result.totalRevenue).toBe(0)
    expect(result.todayRevenue).toBe(0)
    expect(result.totalSales).toBe(0)
    expect(result.totalStock).toBe(0)
    expect(result.totalProducts).toBe(0)
  })

  it('deve lidar com vendas sem produtos', async () => {
    const mockSales = [
      {
        id: '1',
        date: new Date('2024-01-15T10:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
        saleProducts: [],
      },
    ]

    ;(db.sale.findMany as jest.Mock).mockResolvedValue(mockSales)
    ;(db.product.findMany as jest.Mock).mockResolvedValue([])

    const result = await getDashboardStats()

    expect(result.totalRevenue).toBe(0)
    expect(result.todayRevenue).toBe(0)
    expect(result.totalSales).toBe(1)
  })

  it('deve lidar com erros do banco de dados', async () => {
    const error = new Error('Erro ao buscar dados')
    ;(db.sale.findMany as jest.Mock).mockRejectedValue(error)

    await expect(getDashboardStats()).rejects.toThrow('Erro ao buscar dados')
  })
})

