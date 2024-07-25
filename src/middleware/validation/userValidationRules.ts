import { body } from "express-validator";

export const userValidationRules = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("Title is required and must be a string"),
  body("first_name")
    .isString()
    .notEmpty()
    .withMessage("First name is required and must be a string"),
  body("last_name")
    .isString()
    .notEmpty()
    .withMessage("Last name is required and must be a string"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("roles")
    .isArray()
    .withMessage("Roles must be an array")
    .custom((roles: string[]) =>
      roles.every((role) =>
        ["departmental_lecturer", "level_coordinator", "super_admin"].includes(
          role
        )
      )
    )
    .withMessage("Invalid role(s) provided"),
];
