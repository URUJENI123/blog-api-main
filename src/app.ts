import "reflect-metadata";
import express, { Express } from "express";
import * as dotenv from "dotenv";
import usersRouter from "./routes/users";
import { initializeDatabase } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/auth";
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/api", postRoutes)

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
