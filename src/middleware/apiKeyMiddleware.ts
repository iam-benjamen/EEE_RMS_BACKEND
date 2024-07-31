import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { formatResponse } from "../utils/responseFormatter";

dotenv.config();

const APP_KEY =
  process.env.APP_KEY || "120138ed-86b8-7ey11-nw9z2L-6j6V4bZQ4594";

export const appKeyMiddleware = (
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

  next();
};
