import { login } from "../controllers/authController";
import { Router } from "express";
import express from "express";

const authRouter: Router = express.Router();

/**
 * @swagger
 * /api/auth
 */

//Login route with email and password
authRouter.post("/login", login);

export default authRouter