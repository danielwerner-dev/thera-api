import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import * as bcrypt from "bcrypt"
import { User } from "../../users/entities/user.entity"
import { Product } from "../../products/entities/product.entity"
import { Order } from "../../orders/entities/order.entity"
import { OrderItem } from "../../orders/entities/order-item.entity"
import { OrderStatus } from "../../orders/enums/order-status.enum"

dotenv.config()

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "products_api",
  entities: ["src/**/*.entity{.ts,.js}"],
  synchronize: false,
  logging: process.env.DB_LOGGING === "true",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})

async function seed() {
  try {
    await dataSource.initialize()
    console.log("Conexão com o banco de dados estabelecida")

    // Limpar dados existentes
    await dataSource.query("TRUNCATE TABLE order_items CASCADE")
    await dataSource.query("TRUNCATE TABLE orders CASCADE")
    await dataSource.query("TRUNCATE TABLE products CASCADE")
    await dataSource.query("TRUNCATE TABLE users CASCADE")

    console.log("Tabelas limpas com sucesso")

    // Criar usuários
    const adminPassword = await bcrypt.hash("admin123", 10)
    const userPassword = await bcrypt.hash("user123", 10)

    const admin = dataSource.manager.create(User, {
      email: "admin@example.com",
      nome: "Administrador",
      senha: adminPassword,
      isAdmin: true,
    })

    const user = dataSource.manager.create(User, {
      email: "user@example.com",
      nome: "Usuário Comum",
      senha: userPassword,
      isAdmin: false,
    })

    await dataSource.manager.save([admin, user])
    console.log("Usuários criados com sucesso")

    // Criar produtos
    const products = dataSource.manager.create(Product, [
      {
        nome: "Smartphone XYZ",
        categoria: "Eletrônicos",
        descricao: "Smartphone de última geração com câmera de alta resolução",
        preco: 1999.99,
        quantidade_estoque: 50,
      },
      {
        nome: "Notebook ABC",
        categoria: "Eletrônicos",
        descricao: "Notebook potente para trabalho e jogos",
        preco: 4500.0,
        quantidade_estoque: 20,
      },
      {
        nome: "Fones de Ouvido Bluetooth",
        categoria: "Acessórios",
        descricao: "Fones de ouvido sem fio com cancelamento de ruído",
        preco: 299.99,
        quantidade_estoque: 100,
      },
      {
        nome: "Mouse Gamer",
        categoria: "Acessórios",
        descricao: "Mouse de alta precisão para jogos",
        preco: 149.99,
        quantidade_estoque: 75,
      },
      {
        nome: "Smart TV 4K",
        categoria: "Eletrônicos",
        descricao: "TV 4K com sistema operacional inteligente",
        preco: 3299.99,
        quantidade_estoque: 15,
      },
    ])

    const savedProducts = await dataSource.manager.save(products)
    console.log("Produtos criados com sucesso")

    // Criar pedidos
    const order1 = dataSource.manager.create(Order, {
      status: OrderStatus.CONCLUIDO,
      total_pedido: 0, // Será calculado
    })

    const order2 = dataSource.manager.create(Order, {
      status: OrderStatus.PENDENTE,
      total_pedido: 0, // Será calculado
    })

    const savedOrders = await dataSource.manager.save([order1, order2])
    console.log("Pedidos criados com sucesso")

    // Criar itens de pedido
    const orderItems = [
      dataSource.manager.create(OrderItem, {
        order: savedOrders[0],
        product: savedProducts[0],
        productId: savedProducts[0].id,
        quantidade: 1,
        preco_unitario: savedProducts[0].preco,
        subtotal: savedProducts[0].preco * 1,
      }),
      dataSource.manager.create(OrderItem, {
        order: savedOrders[0],
        product: savedProducts[2],
        productId: savedProducts[2].id,
        quantidade: 2,
        preco_unitario: savedProducts[2].preco,
        subtotal: savedProducts[2].preco * 2,
      }),
      dataSource.manager.create(OrderItem, {
        order: savedOrders[1],
        product: savedProducts[1],
        productId: savedProducts[1].id,
        quantidade: 1,
        preco_unitario: savedProducts[1].preco,
        subtotal: savedProducts[1].preco * 1,
      }),
    ]

    await dataSource.manager.save(orderItems)
    console.log("Itens de pedido criados com sucesso")

    // Atualizar totais dos pedidos
    order1.total_pedido = orderItems
      .filter((item) => item.order.id === order1.id)
      .reduce((total, item) => total + item.subtotal, 0)

    order2.total_pedido = orderItems
      .filter((item) => item.order.id === order2.id)
      .reduce((total, item) => total + item.subtotal, 0)

    await dataSource.manager.save([order1, order2])
    console.log("Totais dos pedidos atualizados com sucesso")

    console.log("Seed concluído com sucesso!")
  } catch (error) {
    console.error("Erro ao executar seed:", error)
  } finally {
    await dataSource.destroy()
    console.log("Conexão com o banco de dados fechada")
  }
}

seed()
