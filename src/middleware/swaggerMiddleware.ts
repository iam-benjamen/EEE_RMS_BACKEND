import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { swaggerSpec } from "../config/swagger";

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
