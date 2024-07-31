import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "./error";
import { formatResponse } from "./responseFormatter";
import { pool } from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserByIdQuery } from "../models/userModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "some-secret-key";
const APP_KEY =
  process.env.APP_KEY || "120138ed-86b8-7ey11-nw9z2L-6j6V4bZQ4594";

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "3h" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appKey = req.header("X-APP-KEY");
  if (!appKey || appKey !== APP_KEY) {
    return res
      .status(403)
      .json(formatResponse(false, "Invalid application key", null));
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json(formatResponse(false, "No Auth Token Provided", null));
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json(formatResponse(false, "Invalid Auth Token Provided", null));
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
