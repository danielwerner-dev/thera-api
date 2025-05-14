import type { MigrationInterface, QueryRunner } from "typeorm"

export class InitialMigration1631234567890 implements MigrationInterface {
  name = "InitialMigration1631234567890"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para status de pedido
    await queryRunner.query(`
      CREATE TYPE "public"."order_status_enum" AS ENUM('pendente', 'concluido', 'cancelado')
    `)

    // Criar tabela de usuários
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(100) NOT NULL,
        "nome" character varying(100) NOT NULL,
        "senha" character varying NOT NULL,
        "is_admin" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `)

    // Criar índice para email
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")
    `)

    // Criar tabela de produtos
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nome" character varying(100) NOT NULL,
        "categoria" character varying(50) NOT NULL,
        "descricao" text NOT NULL,
        "preco" numeric(10,2) NOT NULL,
        "quantidade_estoque" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `)

    // Criar índices para produtos
    await queryRunner.query(`
      CREATE INDEX "IDX_products_nome" ON "products" ("nome")
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_products_categoria" ON "products" ("categoria")
    `)

    // Criar tabela de pedidos
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "total_pedido" numeric(10,2) NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'pendente',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id")
      )
    `)

    // Criar índice para status de pedido
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_status" ON "orders" ("status")
    `)

    // Criar tabela de itens de pedido
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" uuid NOT NULL,
        "quantidade" integer NOT NULL,
        "preco_unitario" numeric(10,2) NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "order_id" uuid,
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id")
      )
    `)

    // Adicionar chaves estrangeiras
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD CONSTRAINT "FK_order_items_orders" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `)
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD CONSTRAINT "FK_order_items_products" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)

    // Habilitar extensão uuid-ossp se não estiver habilitada
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover chaves estrangeiras
    await queryRunner.query(`
      ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_products"
    `)
    await queryRunner.query(`
      ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_orders"
    `)

    // Remover tabelas
    await queryRunner.query(`
      DROP TABLE "order_items"
    `)
    await queryRunner.query(`
      DROP TABLE "orders"
    `)
    await queryRunner.query(`
      DROP TABLE "products"
    `)
    await queryRunner.query(`
      DROP TABLE "users"
    `)

    // Remover enum
    await queryRunner.query(`
      DROP TYPE "public"."order_status_enum"
    `)
  }
}
