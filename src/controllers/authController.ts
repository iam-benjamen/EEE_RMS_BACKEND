import { formatResponse } from "../utils/responseFormatter";
import { Response, Request, NextFunction } from "express";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/error";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { getUserByEmailQuery } from "../models/authModel";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const result = await getUserByEmailQuery(email);

    if (result.rows.length === 0) {
      throw new NotFoundError("User not found");
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = generateToken(user.id);

    res.json(
      formatResponse(true, "Login successful", {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone_number: user.phone_number,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: user.roles,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};
