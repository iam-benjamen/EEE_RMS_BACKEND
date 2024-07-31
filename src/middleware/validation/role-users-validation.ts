import { body } from "express-validator";

export const roleAssignmentRules = [
  body("role_id")
    .isNumeric()
    .withMessage("Role id should be a number")
    .notEmpty()
    .withMessage("Role id cannot be empty"),
  body("user_ids").isArray().withMessage("User ids must be an array"),
];
