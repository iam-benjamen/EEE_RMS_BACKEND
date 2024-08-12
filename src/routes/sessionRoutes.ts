import express, { Router } from "express";
import { authMiddleware } from "../utils/jwt";
import * as sessionsController from "../controllers/sessionsController";
import { isRestrictedTo } from "../controllers/userController";
import { sessionValidationRules } from "../middleware/validation/sessionValidation";
import { validate } from "../middleware/validate";

const sessionRouter: Router = express.Router();

sessionRouter.get("/", authMiddleware, sessionsController.getAllSessions);
sessionRouter.get("/:id", authMiddleware, sessionsController.getSingleSession);
sessionRouter.post(
  "/",
  authMiddleware,
  isRestrictedTo("super_admin"),
  sessionValidationRules,
  validate,
  sessionsController.createSession
);

export default sessionRouter;
