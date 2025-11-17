import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { upsertProduct } from '@/app/_actions/product/upsert-product'
import { deleteProduct } from '@/app/_actions/product/delete-product'
import { getProducts } from '@/app/_data-acess/product/get-produts'
import { db } from '@/app/_lib/prisma'
import { revalidatePath } from 'next/cache'

describe('Fluxo de Integração - Produtos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve criar, listar e deletar um produto', async () => {
    const productData = {
      name: 'Produto de Teste',
      price: 25.5,
      stock: 15,
    }

    const createdProduct = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Mock: Criar produto
    ;(db.product.upsert as jest.Mock).mockResolvedValueOnce(createdProduct)

    // Criar produto
    await upsertProduct(productData)

    expect(db.product.upsert).toHaveBeenCalledWith({
      where: { id: '' },
      update: productData,
      create: productData,
    })

    // Mock: Listar produtos
    ;(db.product.findMany as jest.Mock).mockResolvedValueOnce([createdProduct])

    // Listar produtos
    const products = await getProducts()

    expect(products).toHaveLength(1)
    expect(products[0]).toMatchObject({
      ...createdProduct,
      status: 'IN_STOCK',
    })

    // Mock: Deletar produto
    ;(db.product.delete as jest.Mock).mockResolvedValueOnce(createdProduct)

    // Deletar produto
    await deleteProduct({ id: createdProduct.id })

    expect(db.product.delete).toHaveBeenCalledWith({
      where: { id: createdProduct.id },
    })

    // Mock: Listar produtos após deletar
    ;(db.product.findMany as jest.Mock).mockResolvedValueOnce([])

    const productsAfterDelete = await getProducts()

    expect(productsAfterDelete).toHaveLength(0)
  })

  it('deve criar, atualizar e verificar produto', async () => {
    const initialProduct = {
      name: 'Produto Inicial',
      price: 10.0,
      stock: 5,
    }

    const createdProduct = {
      id: '223e4567-e89b-12d3-a456-426614174000',
      ...initialProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Criar produto
    ;(db.product.upsert as jest.Mock).mockResolvedValueOnce(createdProduct)
    await upsertProduct(initialProduct)

    // Atualizar produto
    const updatedProduct = {
      id: createdProduct.id,
      name: 'Produto Atualizado',
      price: 15.0,
      stock: 10,
    }

    ;(db.product.upsert as jest.Mock).mockResolvedValueOnce({
      ...updatedProduct,
      createdAt: createdProduct.createdAt,
      updatedAt: new Date(),
    })

    await upsertProduct(updatedProduct)

    expect(db.product.upsert).toHaveBeenCalledWith({
      where: { id: createdProduct.id },
      update: updatedProduct,
      create: updatedProduct,
    })

    // Verificar produto atualizado
    ;(db.product.findMany as jest.Mock).mockResolvedValueOnce([{
      ...updatedProduct,
      createdAt: createdProduct.createdAt,
      updatedAt: new Date(),
    }])

    const products = await getProducts()

    expect(products[0].name).toBe('Produto Atualizado')
    expect(products[0].price).toBe(15.0)
    expect(products[0].stock).toBe(10)
  })

  it('deve gerenciar status de estoque corretamente', async () => {
    const productWithStock = {
      id: 'product-1',
      name: 'Produto com Estoque',
      price: 10.0,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const productWithoutStock = {
      id: 'product-2',
      name: 'Produto sem Estoque',
      price: 20.0,
      stock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(db.product.findMany as jest.Mock).mockResolvedValueOnce([
      productWithStock,
      productWithoutStock,
    ])

    const products = await getProducts()

    expect(products[0].status).toBe('IN_STOCK')
    expect(products[1].status).toBe('OUT_OF_STOCK')
  })
})

