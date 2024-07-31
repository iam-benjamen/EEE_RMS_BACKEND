import { setupSwagger } from "./middleware/swaggerMiddleware";
import { port } from "./utils/config";
import { pool } from "./db";
import app from "./app";
import { errorHandler } from "./middleware/errorHandler";

/**
 * DATABASE CONNECTION
 */
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

/**
 * SWAGGER DOCUMENTATION
 */
setupSwagger(app);


//Global Error Handler
app.use(errorHandler);

/**
 * SERVER ACTIVATION
 */
const devport = port || 5000;

app.listen(devport, () => {
  console.log(`Server running at https://localhost:${devport}`);
});
