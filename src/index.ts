import { setupSwagger } from "./middleware/swaggerMiddleware";
import { port } from "./utils/config";
import { pool } from "./db";
import app from "./app";

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

/**
 * SERVER ACTIVATION
 */
const devport = port || 5000;

app.listen(devport, () => {
  console.log(`Server running at https://localhost:${devport}`);
});
