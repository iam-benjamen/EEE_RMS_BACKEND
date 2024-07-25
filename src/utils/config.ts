import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";

if (env === "production") {
  dotenv.config({ path: ".env.prod" });
} else {
  dotenv.config({ path: ".env" });
}

export const port = process.env.PORT;
