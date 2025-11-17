import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { deleteProduct } from '../delete-product'
import { db } from '@/app/_lib/prisma'
import { revalidatePath } from 'next/cache'

describe('deleteProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve deletar um produto com sucesso', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    ;(db.product.delete as jest.Mock).mockResolvedValue({
      id: productId,
    })

    await deleteProduct({ id: productId })

    expect(db.product.delete).toHaveBeenCalledWith({
      where: { id: productId },
    })
    expect(revalidatePath).toHaveBeenCalledWith('/products')
  })

  it('deve lançar erro quando id não é fornecido', async () => {
    await expect(deleteProduct({ id: '' } as any)).rejects.toThrow()
    expect(db.product.delete).not.toHaveBeenCalled()
  })

  it('deve lançar erro quando id não é um UUID válido', async () => {
    await expect(deleteProduct({ id: 'invalid-id' } as any)).rejects.toThrow()
    expect(db.product.delete).not.toHaveBeenCalled()
  })

  it('deve lidar com erro quando produto não existe', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'
    const error = new Error('Produto não encontrado')
    ;(db.product.delete as jest.Mock).mockRejectedValue(error)

    await expect(deleteProduct({ id: productId })).rejects.toThrow('Produto não encontrado')
  })

  it('deve lidar com erros do banco de dados', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'
    const error = new Error('Erro ao deletar produto')
    ;(db.product.delete as jest.Mock).mockRejectedValue(error)

    await expect(deleteProduct({ id: productId })).rejects.toThrow('Erro ao deletar produto')
  })
})

