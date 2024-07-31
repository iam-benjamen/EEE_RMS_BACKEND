import { login } from "../controllers/authController";
import { Router } from "express";
import express from "express";
import { appKeyMiddleware } from "../middleware/apiKeyMiddleware";

const authRouter: Router = express.Router();

/**
 * @swagger
 * /api/auth
 */

//Login route with email and password
authRouter.post("/login", appKeyMiddleware, login);

export default authRouter;
