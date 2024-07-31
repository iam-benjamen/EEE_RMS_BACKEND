import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { formatResponse } from "../utils/responseFormatter";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return res
      .status(400)
      .json(
        formatResponse(
          false,
          "Input error: Please ensure all form fields are filled correctly",
          { errors: errorMessages }
        )
      );
  }
  next();
};
