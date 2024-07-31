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
  body("phone_number")
    .isString()
    .notEmpty()
    .withMessage("Phone Number required and must be a string!"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password required and must be a string!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
