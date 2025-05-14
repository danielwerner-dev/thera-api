# API RESTful de Produtos com NestJS

Esta é uma API RESTful para gerenciamento de produtos e pedidos, construída com NestJS, PostgreSQL e seguindo os princípios SOLID.

## Características

- CRUD completo para produtos
- Gerenciamento de pedidos
- Autenticação JWT
- Documentação com Swagger
- Persistência de dados com PostgreSQL e TypeORM
- Testes unitários
- Logging de requisições
- Arquitetura em camadas
- Migrações de banco de dados

## Arquitetura

### Estrutura do Projeto
```sh
src/
├── auth/                  # Módulo de autenticação
│   ├── controllers/       # Controladores de autenticação
│   ├── dto/               # DTOs para autenticação
│   ├── interfaces/        # Interfaces para autenticação
│   ├── services/          # Serviços de autenticação
│   └── strategies/        # Estratégias de autenticação JWT
├── common/                # Módulo comum
│   ├── filters/           # Filtros de exceção
│   ├── interceptors/      # Interceptores
│   ├── middleware/        # Middlewares
│   └── services/          # Serviços comuns
├── config/                # Configurações da aplicação
├── database/              # Configurações de banco de dados
│   ├── migrations/        # Migrações do TypeORM
│   └── seeds/             # Scripts para popular o banco
├── orders/                # Módulo de pedidos
│   ├── controllers/       # Controladores de pedidos
│   ├── dto/               # DTOs para pedidos
│   ├── entities/          # Entidades de pedidos
│   ├── interfaces/        # Interfaces para pedidos
│   ├── repositories/      # Repositórios de pedidos
│   └── services/          # Serviços de pedidos
├── products/              # Módulo de produtos
│   ├── controllers/       # Controladores de produtos
│   ├── dto/               # DTOs para produtos
│   ├── entities/          # Entidades de produtos
│   ├── interfaces/        # Interfaces para produtos
│   ├── repositories/      # Repositórios de produtos
│   └── services/          # Serviços de produtos
└── users/                 # Módulo de usuários
    ├── entities/          # Entidades de usuários
    ├── interfaces/        # Interfaces para usuários
    ├── repositories/      # Repositórios de usuários
    └── services/          # Serviços de usuários
```
A aplicação segue uma arquitetura em camadas bem definida:

- **Controllers**: Responsáveis por receber requisições HTTP e retornar respostas
- **Services**: Contêm a lógica de negócios
- **Repositories**: Responsáveis pelo acesso aos dados
- **Entities**: Modelos de dados
- **DTOs**: Objetos de transferência de dados
- **Interfaces**: Contratos para implementação

Esta arquitetura permite uma melhor separação de responsabilidades e facilita a manutenção e testabilidade do código.

## Requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)

## Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# JWT Configuration
JWT_SECRET=thera_api_secret_key_2024_secure_authentication_token
JWT_EXPIRES_IN=24h

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=products_api
DB_LOGGING=true
DB_SSL=false
```

### Configuração do Banco de Dados

1. Instale o PostgreSQL em sua máquina ou use o Docker Compose fornecido
```
# Iniciar os serviços de banco de dados
$ docker-compose up -d

# Instalar dependências
$ npm install

# Executar migrações
$ npm run migration:run

# Popular o banco de dados com dados iniciais (opcional)
$ npm run seed

# Iniciar a aplicação
$ npm run start:dev
```

2. Crie um banco de dados para a aplicação:

```sql
CREATE DATABASE products_api;
```

## Endpoints da API

A documentação completa da API está disponível através do Swagger em `/api` quando a aplicação estiver em execução.

### Autenticação

- `POST /auth/register`: Registrar um novo usuário
- `POST /auth/login`: Autenticar usuário e obter token JWT


### Produtos

- `GET /produtos`: Lista todos os produtos
- `GET /produtos/:id`: Busca um produto pelo ID
- `POST /produtos`: Cria um novo produto (requer admin)
- `PATCH /produtos/:id`: Atualiza um produto existente (requer admin)
- `DELETE /produtos/:id`: Remove um produto (requer admin)


### Pedidos

- `GET /pedidos`: Lista todos os pedidos
- `GET /pedidos/:id`: Busca um pedido pelo ID
- `POST /pedidos`: Cria um novo pedido

## Testes
```
# Executar todos os testes
npm run test

# Executar testes com watch mode
npm run test:watch

# Executar testes com cobertura
npm run test:cov
```
