# 📦 Stockly

Sistema completo de gestão de estoque e vendas desenvolvido com Next.js 14, oferecendo uma interface moderna e intuitiva para gerenciar produtos, realizar vendas e acompanhar métricas de negócio em tempo real.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=flat&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=flat&logo=prisma)

## ✨ Funcionalidades

### Dashboard Interativo

- 📊 **Visão Geral**: Estatísticas em tempo real do negócio
- 💰 **Receita Total**: Soma de todas as vendas realizadas
- 📅 **Receita do Dia**: Vendas realizadas no dia atual
- 🛒 **Total de Vendas**: Quantidade de vendas realizadas
- 📦 **Controle de Estoque**: Total de produtos em estoque
- 📈 **Gráfico de Receita**: Visualização temporal da receita
- 🏆 **Produtos Mais Vendidos**: Ranking dos produtos com maior volume de vendas

### Gestão de Produtos

- ➕ **Cadastro**: Criação de novos produtos com validação
- ✏️ **Edição**: Atualização de informações de produtos existentes
- 🗑️ **Exclusão**: Remoção segura de produtos
- 💵 **Controle de Preço**: Gerenciamento de preços com validação
- 📊 **Controle de Estoque**: Acompanhamento de quantidade disponível
- 🔍 **Tabela Interativa**: Busca, ordenação e filtros avançados
- ⚠️ **Status de Estoque**: Indicação visual de produtos em falta

### Gestão de Vendas

- 🛒 **Registro de Vendas**: Criação de vendas com múltiplos produtos
- 🔄 **Atualização Automática**: Estoque atualizado automaticamente
- 💰 **Cálculo Automático**: Valores calculados automaticamente
- 📜 **Histórico Completo**: Visualização de todas as vendas realizadas
- ✏️ **Edição**: Modificação de vendas existentes
- 🗑️ **Exclusão**: Remoção de vendas com restauração de estoque
- ✅ **Validações**: Verificação de estoque e existência de produtos

## 🛠️ Tecnologias

### Core

- **Next.js 14.2.10** - Framework React com App Router
- **TypeScript 5** - Tipagem estática
- **React 18** - Biblioteca UI
- **Node.js 18+** - Runtime JavaScript

### Estilização

- **Tailwind CSS 3.4** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e sem estilo
- **shadcn/ui** - Componentes UI construídos com Radix
- **Lucide React** - Ícones modernos

### Banco de Dados

- **PostgreSQL** - Banco de dados relacional
- **Prisma 5.10** - ORM moderno e type-safe

### Formulários e Validação

- **React Hook Form 7.65** - Gerenciamento de formulários
- **Zod 4.1** - Validação de schemas
- **@hookform/resolvers** - Integração Zod + React Hook Form

### UI e Componentes

- **TanStack Table 8.21** - Tabelas poderosas e flexíveis
- **Recharts 3.4** - Gráficos e visualizações
- **Sonner 2.0** - Notificações toast elegantes
- **next-themes** - Suporte a temas (claro/escuro)

### Testes e Qualidade

- **Jest 30.2** - Framework de testes
- **Testing Library** - Utilitários para testes de componentes
- **swagger-jsdoc** - Documentação OpenAPI
- **swagger-ui-react** - Interface Swagger

### Outros

- **next-safe-action** - Server Actions type-safe
- **server-only** - Garantia de código apenas no servidor

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0 ou superior
- **npm**, **yarn**, **pnpm** ou **bun**
- **PostgreSQL** 12+ (ou acesso a um banco de dados PostgreSQL)
- **Git** (para clonar o repositório)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd stockly
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/stockly?schema=public"
```

**Exemplo para PostgreSQL local:**

```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/stockly?schema=public"
```

### 4. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrações
npx prisma migrate dev
```

Isso criará todas as tabelas necessárias no banco de dados.

## 🎯 Como Executar

### Modo de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

### Outros Comandos Úteis

```bash
# Executar linter
npm run lint

# Abrir Prisma Studio (interface visual do banco)
npx prisma studio
```

## 📁 Estrutura do Projeto

```
stockly/
├── app/                          # App Router do Next.js
│   ├── _actions/                 # Server Actions
│   │   ├── product/             # Ações de produtos
│   │   │   ├── upsert-product/   # Criar/atualizar produto
│   │   │   └── delete-product/   # Deletar produto
│   │   └── sale/                 # Ações de vendas
│   │       ├── upsert-sale/      # Criar/atualizar venda
│   │       └── delete-sale/     # Deletar venda
│   ├── _components/              # Componentes reutilizáveis
│   │   ├── ui/                   # Componentes UI (shadcn/ui)
│   │   ├── header.tsx            # Cabeçalho da aplicação
│   │   ├── sidebar.tsx           # Barra lateral de navegação
│   │   └── sidebar-button.tsx    # Botão da sidebar
│   ├── _data-acess/              # Camada de acesso a dados
│   │   ├── dashboard/            # Dados do dashboard
│   │   ├── product/              # Dados de produtos
│   │   └── sales/                # Dados de vendas
│   ├── _lib/                     # Utilitários e configurações
│   │   ├── prisma.ts             # Cliente Prisma
│   │   ├── safe-action.ts        # Configuração de actions
│   │   ├── swagger.ts            # Configuração Swagger
│   │   └── utils.ts             # Funções utilitárias
│   ├── (dashboard)/              # Grupo de rotas do dashboard
│   │   ├── _components/          # Componentes do dashboard
│   │   └── page.tsx              # Página principal
│   ├── products/                 # Página de produtos
│   │   ├── _components/          # Componentes de produtos
│   │   └── page.tsx              # Lista de produtos
│   ├── sales/                    # Página de vendas
│   │   ├── _components/          # Componentes de vendas
│   │   └── page.tsx              # Lista de vendas
│   ├── api/                      # Rotas de API
│   │   └── docs/                 # Endpoint de documentação Swagger
│   ├── api-docs/                 # Página de documentação Swagger UI
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Estilos globais
├── prisma/                       # Configuração Prisma
│   ├── migrations/               # Migrações do banco
│   └── schema.prisma             # Schema do banco de dados
├── __tests__/                    # Testes de integração
├── __mocks__/                    # Mocks para testes
├── jest.config.js                # Configuração Jest
├── jest.setup.js                 # Setup dos testes
├── next.config.mjs                # Configuração Next.js
├── tailwind.config.ts            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
└── package.json                  # Dependências do projeto
```

## 🗄️ Modelo de Dados

O sistema utiliza três entidades principais relacionadas:

### Product (Produto)

Armazena informações dos produtos cadastrados.

```typescript
{
  id: string (UUID)
  name: string
  price: Decimal(10, 2)
  stock: number
  createdAt: DateTime
  updatedAt: DateTime
  saleProducts: SaleProduct[] // Relacionamento
}
```

**Campos:**

- `id`: Identificador único (UUID)
- `name`: Nome do produto
- `price`: Preço unitário (decimal com 2 casas)
- `stock`: Quantidade em estoque
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

### Sale (Venda)

Representa uma venda realizada.

```typescript
{
  id: string (UUID)
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
  saleProducts: SaleProduct[] // Relacionamento
}
```

**Campos:**

- `id`: Identificador único (UUID)
- `date`: Data da venda
- `createdAt`: Data de criação do registro
- `updatedAt`: Data da última atualização

### SaleProduct (Produto da Venda)

Tabela de relacionamento entre vendas e produtos, armazenando informações da venda.

```typescript
{
  id: string(UUID);
  saleId: string(FK);
  productId: string(FK);
  unitPrice: Decimal(10, 2);
  quantity: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

**Campos:**

- `id`: Identificador único (UUID)
- `saleId`: Referência à venda
- `productId`: Referência ao produto
- `unitPrice`: Preço unitário no momento da venda
- `quantity`: Quantidade vendida

**Relacionamentos:**

- `Sale` → `SaleProduct` (1:N) - Uma venda pode ter vários produtos
- `Product` → `SaleProduct` (1:N) - Um produto pode estar em várias vendas

## 📚 Documentação da API (Swagger)

O projeto possui documentação completa e interativa da API usando Swagger/OpenAPI 3.0.

### Acessar a Documentação

Após iniciar o servidor de desenvolvimento:

**Interface Swagger UI:**

```
http://localhost:3000/api-docs
```

**Especificação OpenAPI (JSON):**

```
http://localhost:3000/api/docs
```

### Recursos da Documentação

- 📖 **Documentação Completa**: Todas as Server Actions e funções de acesso a dados
- 🔍 **Exploração Interativa**: Navegue pelos endpoints de forma intuitiva
- 📝 **Exemplos de Requisições**: Exemplos prontos para uso
- 📊 **Schemas de Dados**: Definições completas dos modelos
- ✅ **Códigos de Resposta**: Documentação de todos os possíveis retornos
- ⚠️ **Validações**: Regras de negócio e validações documentadas

### Endpoints Documentados

#### Produtos

- `POST /api/actions/product/upsert` - Criar ou atualizar produto
- `DELETE /api/actions/product/delete` - Deletar produto
- `GET /api/data-access/products` - Listar todos os produtos

#### Vendas

- `POST /api/actions/sale/upsert` - Criar ou atualizar venda
- `DELETE /api/actions/sale/delete` - Deletar venda
- `GET /api/data-access/sales` - Listar todas as vendas

#### Dashboard

- `GET /api/data-access/dashboard/stats` - Estatísticas do dashboard

### Exemplo de Uso da API

```typescript
// Criar um produto
const product = await upsertProduct({
  name: "Produto Exemplo",
  price: 29.99,
  stock: 100,
});

// Criar uma venda
const sale = await upsertSaleAction({
  products: [{ id: "product-id", quantity: 2 }],
});
```

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários e de integração usando Jest.

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa ao salvar)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Cobertura de Testes

O projeto mantém uma cobertura mínima de **70%** em:

- ✅ **Branches**: Ramificações de código
- ✅ **Funções**: Todas as funções testadas
- ✅ **Linhas**: Linhas de código executadas
- ✅ **Statements**: Statements executados

### Estrutura de Testes

#### Testes Unitários

Testam funções individuais isoladamente com mocks:

- **Acesso a Dados**:
  - `get-products.test.ts` - Listagem e status de produtos
  - `get-sales.test.ts` - Formatação e cálculos de vendas
  - `get-dashboard-stats.test.ts` - Estatísticas do dashboard

- **Server Actions**:
  - `upsert-product.test.ts` - Criação e atualização de produtos
  - `delete-product.test.ts` - Exclusão de produtos
  - `upsert-sale.test.ts` - Criação/atualização de vendas com validações

#### Testes de Integração

Testam fluxos completos que envolvem múltiplas funções:

- `product-flow.test.ts` - Fluxo completo de produtos (criar, listar, atualizar, deletar)
- `sale-flow.test.ts` - Fluxo completo de vendas (criar vendas, atualizar estoque, validações)

### Exemplo de Teste

```typescript
describe("getProducts", () => {
  it("deve retornar lista de produtos com status IN_STOCK quando estoque > 0", async () => {
    const products = await getProducts();
    expect(products[0].status).toBe("IN_STOCK");
  });
});
```

## 📝 Scripts Disponíveis

| Comando                 | Descrição                                 |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Inicia o servidor de desenvolvimento      |
| `npm run build`         | Cria o build otimizado para produção      |
| `npm run start`         | Inicia o servidor de produção             |
| `npm run lint`          | Executa o linter ESLint                   |
| `npm test`              | Executa todos os testes                   |
| `npm run test:watch`    | Executa testes em modo watch              |
| `npm run test:coverage` | Executa testes com relatório de cobertura |

## 🔧 Configuração Adicional

### Prisma Studio

Interface visual para visualizar e editar dados do banco:

```bash
npx prisma studio
```

Acesse em: `http://localhost:5555`

### Migrações do Banco de Dados

**Criar uma nova migração:**

```bash
npx prisma migrate dev --name nome_da_migracao
```

**Aplicar migrações em produção:**

```bash
npx prisma migrate deploy
```

**Resetar o banco de dados (desenvolvimento):**

```bash
npx prisma migrate reset
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/stockly?schema=public"

# Opcional: Configurações adicionais
NODE_ENV=development
```

## 🏗️ Arquitetura

### Padrão de Arquitetura

O projeto segue uma arquitetura em camadas:

1. **Camada de Apresentação** (`app/`)
   - Componentes React
   - Páginas Next.js
   - UI Components

2. **Camada de Ação** (`app/_actions/`)
   - Server Actions
   - Validação com Zod
   - Lógica de negócio

3. **Camada de Acesso a Dados** (`app/_data-acess/`)
   - Funções de consulta ao banco
   - Transformação de dados
   - Queries Prisma

4. **Camada de Infraestrutura** (`app/_lib/`)
   - Configuração do Prisma
   - Utilitários
   - Helpers

### Fluxo de Dados

```
Componente → Server Action → Data Access → Prisma → PostgreSQL
                ↓
            Validação (Zod)
                ↓
            Revalidação de Cache
```

### Princípios Aplicados

- ✅ **Separation of Concerns**: Separação clara de responsabilidades
- ✅ **Type Safety**: TypeScript em todo o projeto
- ✅ **Server Components**: Uso de Server Components do Next.js
- ✅ **Server Actions**: Ações do servidor type-safe
- ✅ **Validação**: Validação em múltiplas camadas (cliente e servidor)

## 💻 Desenvolvimento

### Adicionando Novos Recursos

1. **Criar Schema Prisma** (se necessário):

   ```bash
   npx prisma migrate dev --name add_new_feature
   ```

2. **Criar Data Access Function**:

   ```typescript
   // app/_data-acess/feature/get-feature.ts
   export const getFeature = async () => {
     // Implementação
   };
   ```

3. **Criar Server Action**:

   ```typescript
   // app/_actions/feature/action/index.ts
   export const featureAction = async (data) => {
     // Implementação
   };
   ```

4. **Criar Componentes**:

   ```typescript
   // app/feature/_components/feature-component.tsx
   export const FeatureComponent = () => {
     // Implementação
   };
   ```

5. **Adicionar Testes**:
   ```typescript
   // app/_actions/feature/__tests__/action.test.ts
   describe("featureAction", () => {
     // Testes
   });
   ```

### Convenções de Código

- **Nomenclatura**: camelCase para funções, PascalCase para componentes
- **Estrutura**: Um arquivo por função/componente
- **Imports**: Imports absolutos usando `@/`
- **TypeScript**: Tipos explícitos, evitar `any`
- **Validação**: Sempre validar dados com Zod

### Troubleshooting

**Erro de conexão com banco:**

- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Teste a conexão: `npx prisma db pull`

**Erro de migração:**

- Verifique se o banco está acessível
- Execute `npx prisma migrate reset` (cuidado: apaga dados)

**Erros de build:**

- Limpe o cache: `rm -rf .next`
- Reinstale dependências: `rm -rf node_modules && npm install`

## 📄 Licença

Este projeto é privado e de uso interno.

## 👨‍💻 Desenvolvido com

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Zod](https://zod.dev/) - Validação de schemas
- [Jest](https://jestjs.io/) - Framework de testes
- [Swagger](https://swagger.io/) - Documentação de API

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
