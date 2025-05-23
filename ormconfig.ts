import { DataSource } from "typeorm"
import * as dotenv from "dotenv"

dotenv.config()

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "products_api",
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/database/migrations/*{.ts,.js}"],
  synchronize: false,
  logging: process.env.DB_LOGGING === "true",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})
