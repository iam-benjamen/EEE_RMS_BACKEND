import { NextFunction, Request, Response } from "express";
import {
  createSessionQuery,
  getAllSessionsQuery,
  getSessionByIdQuery,
} from "../models/sessionsModel";
import { formatResponse } from "../utils/responseFormatter";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/error";
import { isEmpty } from "../utils/helpers";

/**
 * FETCH ALL SESSIONS
 * @param req
 * @param res
 * @param next
 */
export const getAllSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllSessionsQuery();
    res.json(formatResponse(true, "Sessions retrieved successfully", result));
  } catch (error) {
    next(error);
  }
};

/**
 * FETCH SINGLE SESSION BY ID
 * @param req
 * @param res
 * @param next
 */
export const getSingleSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = parseInt(req.params.id);

    if (!sessionId) {
      throw new BadRequestError("Mising session id");
    }

    const result = await getSessionByIdQuery(sessionId);

    if (result.rows.length === 0) {
      throw new NotFoundError("Session not found");
    }

    const session = result.rows[0];

    res.json(formatResponse(true, "Session retrieved successfully", session));
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE NEW SESSION
 * @param req
 * @param res
 * @param next
 */
export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, current = false, ...foreign } = req.body;

    //prevent foreign fields
    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!date) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await createSessionQuery(date, current);
    const session = result.rows[0];

    res
      .status(201)
      .json(formatResponse(true, "Session created successfully", session));
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      next(new ConflictError("Session already exists"));
    } else {
      next(error);
    }
  }
};
