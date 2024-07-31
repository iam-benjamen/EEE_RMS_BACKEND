import express, { Router } from "express";
import { authMiddleware } from "../utils/jwt";
import { isRestrictedTo } from "../controllers/userController";
import * as RoleControllers from "../controllers/roleControllers";
import { roleValidationRules } from "../middleware/validation/roleValidation";
import { validate } from "../middleware/validate";
import { roleAssignmentRules } from "../middleware/validation/role-users-validation";

const roleRouter: Router = express.Router();

/**
 * ROLE MANAGEMENT ROUTES
 */
roleRouter.get(
  "/",
  authMiddleware,
  isRestrictedTo("super_admin"),
  RoleControllers.getAllRoles
);

roleRouter.get(
  "/:id",
  authMiddleware,
  isRestrictedTo("super_admin"),
  RoleControllers.getSingleRole
);

roleRouter.post(
  "/",
  authMiddleware,
  isRestrictedTo("super_admin"),
  roleValidationRules,
  validate,
  RoleControllers.createRole
);

roleRouter.put(
  "/:id",
  authMiddleware,
  isRestrictedTo("super_admin"),
  RoleControllers.updateRole
);

roleRouter.delete(
  "/:id",
  authMiddleware,
  isRestrictedTo("super_admin"),
  RoleControllers.deleteRole
);

roleRouter.post(
  "/assign",
  authMiddleware,
  // isRestrictedTo("super_admin"),
  roleAssignmentRules,
  validate,
  RoleControllers.assignRole
);

roleRouter.post(
  "/assign/delete",
  authMiddleware,
  isRestrictedTo("super_admin"),
  RoleControllers.clearRoleAssignment
);

roleRouter.post(
  "/assign/delete-specific",
  authMiddleware,
  isRestrictedTo("super_admin"),
  RoleControllers.clearSpecificRoleAssignment
);

export default roleRouter;
