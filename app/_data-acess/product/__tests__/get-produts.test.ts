import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { getProducts } from '../get-produts'
import { db } from '@/app/_lib/prisma'

describe('getProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve retornar lista de produtos com status IN_STOCK quando estoque > 0', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Produto 1',
        price: 10.5,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Produto 2',
        price: 20.0,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    ;(db.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const result = await getProducts()

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      ...mockProducts[0],
      status: 'IN_STOCK',
    })
    expect(result[1]).toMatchObject({
      ...mockProducts[1],
      status: 'IN_STOCK',
    })
    expect(db.product.findMany).toHaveBeenCalledTimes(1)
  })

  it('deve retornar status OUT_OF_STOCK quando estoque = 0', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Produto 1',
        price: 10.5,
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    ;(db.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const result = await getProducts()

    expect(result[0].status).toBe('OUT_OF_STOCK')
  })

  it('deve retornar array vazio quando não há produtos', async () => {
    ;(db.product.findMany as jest.Mock).mockResolvedValue([])

    const result = await getProducts()

    expect(result).toEqual([])
    expect(db.product.findMany).toHaveBeenCalledTimes(1)
  })

  it('deve lidar com erros do banco de dados', async () => {
    const error = new Error('Erro ao buscar produtos')
    ;(db.product.findMany as jest.Mock).mockRejectedValue(error)

    await expect(getProducts()).rejects.toThrow('Erro ao buscar produtos')
  })
})

