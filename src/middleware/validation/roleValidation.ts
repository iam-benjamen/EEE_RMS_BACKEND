import { body } from "express-validator";

export const roleValidationRules = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Role name is required and must be a string"),
  body("description").isString(),
];
