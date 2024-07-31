import express, { Router } from "express";
import * as usersControllers from "../controllers/userController";
import { userValidationRules } from "../middleware/validation/userValidationRules";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../utils/jwt";

const userRouter: Router = express.Router();

/**
 * @swagger
 * /api/users
 */
//GET USER BY ID(/users/id)
userRouter.get(
  "/:id",
  authMiddleware,
  usersControllers.isRestrictedTo("super_admin"),
  usersControllers.getSingleUser
);

//GET ALL USERS(/users)
userRouter.get(
  "/",
  authMiddleware,
  usersControllers.isRestrictedTo("super_admin"),
  usersControllers.getAllUsers
);

//CREATE USER(/users)
userRouter.post(
  "/",
  authMiddleware,
  usersControllers.isRestrictedTo("super_admin"),
  userValidationRules,
  validate,
  usersControllers.createUser
);

//UPDATE USER(/users/:id)
userRouter.put(
  "/:id",
  authMiddleware,
  usersControllers.isRestrictedTo("super_admin"),
  usersControllers.updateUser
);

//DELETE USER(/users/:id)
userRouter.delete(
  "/:id",
  authMiddleware,
  usersControllers.isRestrictedTo("super_admin"),
  usersControllers.deleteUser
);

export default userRouter;
