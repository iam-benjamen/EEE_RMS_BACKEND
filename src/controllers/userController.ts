import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/responseFormatter";
import { pool } from "../db";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  ConflictError,
  ForbiddenError,
} from "../utils/error";
import { isEmpty } from "../utils/helpers";
import {
  createUserQuery,
  deleteUserQuery,
  getAllUsersQuery,
  getUserByIdQuery,
  updateUserQuery,
} from "../models/userModel";

/**
 * Role based Permission
 * @param role:string
 */
export const isRestrictedTo = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.roles.includes(role)) {
      throw new ForbiddenError(
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

/**
 * FETCH ALL USERS
 * @param req
 * @param res
 * @param next
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllUsersQuery();
    res.json(formatResponse(true, "Users retrieved successfully", result));
  } catch (error) {
    next(new InternalServerError("Error retrieving users"));
  }
};

/**
 * FETCH USER BASED ON ID
 * @param req
 * @param res
 * @param next
 */
export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);

    if (!userId) {
      throw new BadRequestError("Mising user id");
    }

    const result = await getUserByIdQuery(userId);

    if (result.rows.length === 0) {
      throw new NotFoundError("User not found");
    }

    const user = result.rows[0];

    res.json(formatResponse(true, "User retrieved successfully", user));
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE USER
 * @param req
 * @param res
 * @param next
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, first_name, last_name, email, password, roles, ...foreign } =
      req.body;

    //prevent foreign fields
    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!title || !first_name || !last_name || !email || !password || !roles) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await createUserQuery(req.body);
    const user = result.rows[0];

    const sanitizedUser = {
      id: user.id,
      title: user.title,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      roles: user.roles,
    };

    res
      .status(201)
      .json(formatResponse(true, "User created successfully", sanitizedUser));
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      next(new ConflictError("User with this email already exists"));
    } else {
      next(error);
    }
  }
};

/**
 * UPDATE USER FIELDS
 * @param req
 * @param res
 * @param next
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);
    const { title, first_name, last_name, email, roles, ...foreign } = req.body;

    //prevent foreign fields
    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!title || !first_name || !last_name || !email || !roles) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await updateUserQuery(userId, req.body);

    if (result.rows.length === 0) {
      throw new NotFoundError("User not found");
    }

    res.json(formatResponse(true, "User updated successfully", result.rows[0]));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE USER
 * @param req
 * @param res
 * @param next
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);

    if (!userId) {
      throw new BadRequestError("Mising user id");
    }

    const result = await deleteUserQuery(userId);

    if (result.rowCount === 0) {
      throw new NotFoundError("User not found");
    }

    res.json(formatResponse(true, "User deleted successfully", null));
  } catch (error) {
    next(error);
  }
};
