import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Token } from "../entities/Token";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "user_management",
  synchronize: process.env.NODE_ENV !== "production", // Auto-create database schema in development.
  logging: process.env.NODE_ENV !== "production",
  entities: [User, Post, Token],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error during database initialization", error);
    throw error;
  }
};
