import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/authRoutes";
import { formatResponse } from "./utils/responseFormatter";

const app: Express = express();

/**
 * App configurations
 */
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(compression());

/**
 * API Routes configurations
 */
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// custom 404
app.use((req, res, next) => {
  res.status(404).send(formatResponse(false, "Route does not exist", null));
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;
