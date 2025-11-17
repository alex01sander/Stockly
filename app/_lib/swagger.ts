import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stockly API',
      version: '1.0.0',
      description: 'API de gestão de estoque e vendas - Stockly',
      contact: {
        name: 'Stockly Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Operações relacionadas a produtos',
      },
      {
        name: 'Sales',
        description: 'Operações relacionadas a vendas',
      },
      {
        name: 'Dashboard',
        description: 'Estatísticas e dados do dashboard',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'stock'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do produto',
            },
            name: {
              type: 'string',
              description: 'Nome do produto',
              example: 'Produto Exemplo',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Preço do produto',
              example: 29.99,
            },
            stock: {
              type: 'integer',
              description: 'Quantidade em estoque',
              example: 100,
            },
            status: {
              type: 'string',
              enum: ['IN_STOCK', 'OUT_OF_STOCK'],
              description: 'Status do estoque',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Sale: {
          type: 'object',
          required: ['date'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da venda',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data da venda',
            },
            totalAmount: {
              type: 'number',
              format: 'decimal',
              description: 'Valor total da venda',
            },
            totalProducts: {
              type: 'integer',
              description: 'Quantidade total de produtos vendidos',
            },
            productName: {
              type: 'string',
              description: 'Nomes dos produtos vendidos',
            },
            saleProducts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SaleProduct',
              },
            },
          },
        },
        SaleProduct: {
          type: 'object',
          required: ['productId', 'quantity', 'unitPrice'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            saleId: {
              type: 'string',
              format: 'uuid',
            },
            productId: {
              type: 'string',
              format: 'uuid',
            },
            quantity: {
              type: 'integer',
              description: 'Quantidade vendida',
            },
            unitPrice: {
              type: 'number',
              format: 'decimal',
              description: 'Preço unitário no momento da venda',
            },
          },
        },
        UpsertProductRequest: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do produto (opcional para criação)',
            },
            name: {
              type: 'string',
              description: 'Nome do produto',
              example: 'Produto Exemplo',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Preço do produto',
              example: 29.99,
            },
            stock: {
              type: 'integer',
              description: 'Quantidade em estoque',
              example: 100,
            },
          },
        },
        UpsertSaleRequest: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da venda (opcional para criação)',
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID do produto',
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantidade a ser vendida',
                  },
                },
              },
            },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalRevenue: {
              type: 'number',
              format: 'decimal',
              description: 'Receita total',
            },
            todayRevenue: {
              type: 'number',
              format: 'decimal',
              description: 'Receita do dia',
            },
            totalSales: {
              type: 'integer',
              description: 'Total de vendas realizadas',
            },
            totalStock: {
              type: 'integer',
              description: 'Total de produtos em estoque',
            },
            totalProducts: {
              type: 'integer',
              description: 'Total de produtos cadastrados',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  apis: [
    './app/_actions/**/*.ts',
    './app/_data-acess/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

