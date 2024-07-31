import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { formatResponse } from "./utils/responseFormatter";
import authRouter from "./routes/authRoutes";
import courseRouter from "./routes/courseRoutes";
import roleRouter from "./routes/roleRoutes";

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
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/roles", roleRouter);

// 404
app.use((req, res, next) => {
  res.status(404).send(formatResponse(false, "Route does not exist", null));
});


export default app;
