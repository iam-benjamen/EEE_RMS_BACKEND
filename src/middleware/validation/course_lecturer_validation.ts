import { body } from "express-validator";

export const courseAllocationRules = [
  body("course_id")
    .isNumeric()
    .withMessage("Course id should be a number")
    .notEmpty()
    .withMessage("Course id cannot be empty"),
  body("user_ids").isArray().withMessage("User ids must be an array"),
];
