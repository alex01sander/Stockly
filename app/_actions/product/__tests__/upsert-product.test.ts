import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { upsertProduct } from '../upsert-product'
import { db } from '@/app/_lib/prisma'
import { revalidatePath } from 'next/cache'

describe('upsertProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve criar um novo produto quando id não é fornecido', async () => {
    const productData = {
      name: 'Produto Teste',
      price: 10.5,
      stock: 10,
    }

    ;(db.product.upsert as jest.Mock).mockResolvedValue({
      id: 'new-id',
      ...productData,
    })

    await upsertProduct(productData)

    expect(db.product.upsert).toHaveBeenCalledWith({
      where: { id: '' },
      update: productData,
      create: productData,
    })
    expect(revalidatePath).toHaveBeenCalledWith('/products')
  })

  it('deve atualizar um produto existente quando id é fornecido', async () => {
    const productData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Produto Atualizado',
      price: 15.0,
      stock: 20,
    }

    ;(db.product.upsert as jest.Mock).mockResolvedValue(productData)

    await upsertProduct(productData)

    expect(db.product.upsert).toHaveBeenCalledWith({
      where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      update: productData,
      create: productData,
    })
    expect(revalidatePath).toHaveBeenCalledWith('/products')
  })

  it('deve lançar erro quando dados são inválidos', async () => {
    const invalidData = {
      name: '', // Nome vazio
      price: -10, // Preço negativo
      stock: -5, // Estoque negativo
    }

    await expect(upsertProduct(invalidData as any)).rejects.toThrow()
    expect(db.product.upsert).not.toHaveBeenCalled()
  })

  it('deve lançar erro quando preço é menor que 0.01', async () => {
    const invalidData = {
      name: 'Produto',
      price: 0,
      stock: 10,
    }

    await expect(upsertProduct(invalidData as any)).rejects.toThrow()
  })

  it('deve lidar com erros do banco de dados', async () => {
    const productData = {
      name: 'Produto Teste',
      price: 10.5,
      stock: 10,
    }

    const error = new Error('Erro ao salvar produto')
    ;(db.product.upsert as jest.Mock).mockRejectedValue(error)

    await expect(upsertProduct(productData)).rejects.toThrow('Erro ao salvar produto')
  })
})

