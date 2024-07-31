import express, { Router } from "express";
import * as courseControllers from "../controllers/courseController";
import { isRestrictedTo } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../utils/jwt";
import { courseValidationRules } from "../middleware/validation/courseValidation";
import { courseAllocationRules } from "../middleware/validation/course_lecturer_validation";

const courseRouter: Router = express.Router();

courseRouter.get(
  "/",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseControllers.getAllCourses
);

courseRouter.get(
  "/:id",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseControllers.getSingleCourse
);

courseRouter.post(
  "/",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseValidationRules,
  validate,
  courseControllers.createCourse
);

courseRouter.put(
  "/:id",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseControllers.updateCourse
);

courseRouter.delete(
  "/:id",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseControllers.deleteCourse
);

courseRouter.post(
  "/allocate",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseAllocationRules,
  validate,
  courseControllers.allocateCourse
);

courseRouter.post(
  "/allocate/delete",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseControllers.clearCourseAllocations
);

courseRouter.post(
  "/allocate/delete-specific",
  authMiddleware,
  isRestrictedTo("super_admin"),
  courseControllers.clearSpecificCourseAllocation
);

export default courseRouter;
