import { body } from "express-validator";

export const sessionValidationRules = [
  body("date")
    .isString()
    .notEmpty()
    .withMessage("Session Date is required and must be a string"),
];
