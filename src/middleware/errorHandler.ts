import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/responseFormatter";
import { AppError } from "../utils/error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(formatResponse(false, err.message, null));
  }

  // Handle specific PostgreSQL errors
  if (err.name === "QueryResultError") {
    return res
      .status(404)
      .json(formatResponse(false, "Resource not found", null));
  }

  if (err.name === "UniqueViolationError") {
    return res
      .status(409)
      .json(formatResponse(false, "Resource already exists", null));
  }

  // For unhandled errors
  res
    .status(500)
    .json(formatResponse(false, "An unexpected error occurred", null));

};
