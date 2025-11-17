# 📦 Stockly

Sistema de gestão de estoque e vendas desenvolvido com Next.js 14, oferecendo uma interface moderna e intuitiva para gerenciar produtos, realizar vendas e acompanhar métricas de negócio.

## ✨ Funcionalidades

- **Dashboard Interativo**
  - Visão geral com estatísticas em tempo real
  - Receita total e receita do dia
  - Total de vendas realizadas
  - Controle de estoque
  - Gráfico de receita ao longo do tempo
  - Lista dos produtos mais vendidos

- **Gestão de Produtos**
  - Cadastro, edição e exclusão de produtos
  - Controle de preço e estoque
  - Tabela interativa com busca e ordenação

- **Gestão de Vendas**
  - Registro de vendas com múltiplos produtos
  - Cálculo automático de valores
  - Histórico completo de vendas
  - Edição e exclusão de vendas

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **UI Components**: Radix UI
- **Formulários**: React Hook Form + Zod
- **Tabelas**: TanStack Table
- **Gráficos**: Recharts
- **Notificações**: Sonner
- **Validação**: Zod
- **Ações do Servidor**: next-safe-action

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- PostgreSQL (ou acesso a um banco de dados PostgreSQL)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd stockly
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/stockly?schema=public"
```

4. Configure o banco de dados:
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrações
npx prisma migrate dev
```

## 🎯 Como Executar

### Modo de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build de Produção

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start
```

### Outros Comandos

```bash
# Executar linter
npm run lint

# Abrir Prisma Studio (interface visual do banco)
npx prisma studio
```

## 📁 Estrutura do Projeto

```
stockly/
├── app/
│   ├── _actions/          # Server actions (produtos e vendas)
│   ├── _components/       # Componentes reutilizáveis
│   │   └── ui/           # Componentes de UI (shadcn/ui)
│   ├── _data-acess/      # Camada de acesso a dados
│   ├── _lib/             # Utilitários e configurações
│   ├── (dashboard)/      # Página do dashboard
│   ├── products/         # Página de produtos
│   └── sales/            # Página de vendas
├── prisma/
│   ├── migrations/       # Migrações do banco de dados
│   └── schema.prisma     # Schema do Prisma
└── public/               # Arquivos estáticos
```

## 🗄️ Modelo de Dados

O sistema utiliza três entidades principais:

- **Product**: Produtos cadastrados no sistema
  - Nome, preço, estoque
  - Relacionamento com vendas

- **Sale**: Vendas realizadas
  - Data da venda
  - Relacionamento com produtos através de SaleProduct

- **SaleProduct**: Tabela de relacionamento entre vendas e produtos
  - Quantidade vendida
  - Preço unitário no momento da venda

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm test` - Executa todos os testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com relatório de cobertura

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários e de integração usando Jest.

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Cobertura de Testes

O projeto mantém uma cobertura mínima de 70% em:
- Branches (ramificações)
- Funções
- Linhas de código
- Statements

### Estrutura de Testes

- **Testes Unitários**: Testam funções individuais isoladamente
  - Acesso a dados (`get-products`, `get-sales`, `get-dashboard-stats`)
  - Server Actions (`upsert-product`, `delete-product`, `upsert-sale`)

- **Testes de Integração**: Testam fluxos completos
  - Fluxo de produtos (criar, listar, atualizar, deletar)
  - Fluxo de vendas (criar vendas, atualizar estoque, validações)

## 📚 Documentação da API (Swagger)

O projeto possui documentação completa da API usando Swagger/OpenAPI.

### Acessar a Documentação

Após iniciar o servidor de desenvolvimento, acesse:

```
http://localhost:3000/api-docs
```

A documentação interativa permite:
- Visualizar todas as Server Actions e funções de acesso a dados
- Ver exemplos de requisições e respostas
- Testar endpoints diretamente na interface
- Entender os schemas e modelos de dados

### Endpoints Documentados

#### Produtos
- `POST /api/actions/product/upsert` - Criar ou atualizar produto
- `DELETE /api/actions/product/delete` - Deletar produto
- `GET /api/data-access/products` - Listar produtos

#### Vendas
- `POST /api/actions/sale/upsert` - Criar ou atualizar venda
- `DELETE /api/actions/sale/delete` - Deletar venda
- `GET /api/data-access/sales` - Listar vendas

#### Dashboard
- `GET /api/data-access/dashboard/stats` - Estatísticas do dashboard

### Especificação OpenAPI

A especificação OpenAPI completa está disponível em formato JSON:

```
http://localhost:3000/api/docs
```

## 🔧 Configuração Adicional

### Prisma Studio

Para visualizar e editar dados diretamente no banco:

```bash
npx prisma studio
```

### Migrações

Para criar uma nova migração:

```bash
npx prisma migrate dev --name nome_da_migracao
```

Para aplicar migrações em produção:

```bash
npx prisma migrate deploy
```

## 📄 Licença

Este projeto é privado.

## 👨‍💻 Desenvolvido com

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
