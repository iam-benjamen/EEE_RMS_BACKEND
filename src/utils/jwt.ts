import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "./error";
import { formatResponse } from "./responseFormatter";
import { pool } from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserByIdQuery } from "../models/userModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "some-secret-key";

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json(formatResponse(false, "No Auth Token Provided"));
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json(formatResponse(false, "Invalid Auth Token Provided"));
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.userId;
    const result = await getUserByIdQuery(userId);

    if (result.rows.length === 0) {
      throw new NotFoundError("User not found");
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(false, "Invalid Token", null));
  }
};
