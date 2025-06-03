import "reflect-metadata";
import express, { Express } from "express";
import * as dotenv from "dotenv";
import { initializeDatabase } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import routes from './routes';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";
import cors from "cors";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/v1", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
  try {
    // Initialize db connection
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Express server is running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Run the server
startServer();
