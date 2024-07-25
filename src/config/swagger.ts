import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EEE Department Result Management API",
      version: "1.0.0",
      description:
        "API documentation for the Internal Result Management System",
    },
  },
  apis: ["./src/routes/*.ts", "./src/docs/*.yaml"],
};

export const swaggerSpec = swaggerJsdoc(options);
