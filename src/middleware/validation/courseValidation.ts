import { body } from "express-validator";

export const courseValidationRules = [
  body("course_code")
    .isString()
    .notEmpty()
    .withMessage("Course code is required"),

  body("course_title").notEmpty().withMessage("Course title is required"),
  body("course_description")
    .optional()
    .isString()
    .withMessage("Course description must be a string"),
  body("course_unit")
    .notEmpty()
    .withMessage("Course unit is required")
    .isInt({ min: 1, max: 6 })
    .withMessage("Course unit must be an integer between 1 and 6"),
  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn([100, 200, 300, 400, 500, 600, 700])
    .withMessage("Invalid level"),
  body("course_type")
    .notEmpty()
    .withMessage("Course Type is required")
    .isIn(["R", "C", "E"])
    .withMessage("Invalid Type"),
  body("course_department")
    .notEmpty()
    .withMessage("Course Department is required")
    .isIn(["External", "Internal"])
    .withMessage("Invalid Type"),
  body("semester")
    .notEmpty()
    .withMessage("Semester is required")
    .isIn(["first_semester", "second_semester"])
    .withMessage("Semester must be either first or second"),
];
