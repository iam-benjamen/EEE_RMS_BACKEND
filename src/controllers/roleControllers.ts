import { NextFunction, Request, Response } from "express";
import {
  assignRoleQuery,
  checkRoleExistsQuery,
  clearRoleAllocationsQuery,
  clearSpecificRoleAllocationQuery,
  createRoleQuery,
  deleteRoleQuery,
  getAllRolesQuery,
  getRoleByIdQuery,
  updateRoleQuery,
} from "../models/roleModel";
import { formatResponse } from "../utils/responseFormatter";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/error";
import { isEmpty } from "../utils/helpers";
import { checkUsersExistQuery } from "../models/courseModel";
import { getUserByIdQuery } from "../models/userModel";

/**
 * FETCH ALL ROLES
 * @param req
 * @param res
 * @param next
 */
export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllRolesQuery();
    res.json(formatResponse(true, "Roles retrieved successfully", result));
  } catch (error) {
    next(error);
  }
};

/**
 * FETCH ROLE BASED ON ID
 * @param req
 * @param res
 * @param next
 */
export const getSingleRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = parseInt(req.params.id);

    if (!roleId) {
      throw new BadRequestError("Mising role id");
    }

    const result = await getRoleByIdQuery(roleId);

    if (result.rows.length === 0) {
      throw new NotFoundError("Role not found");
    }

    const role = result.rows[0];

    res.json(formatResponse(true, "Role retrieved successfully", role));
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE ROLE
 * @param req
 * @param res
 * @param next
 */
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, ...foreign } = req.body;

    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!name) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await createRoleQuery(req.body);
    const role = result.rows[0];

    res
      .status(201)
      .json(formatResponse(true, "Role Created successfully", role));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      next(new ConflictError("Role already exists"));
    } else {
      next(error);
    }
  }
};

/**
 * UPDATE ROLE
 * @param req
 * @param res
 * @param next
 */
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = parseInt(req.params.id);

    if (!roleId) {
      throw new BadRequestError("role id not provided");
    }

    const { name, description, ...foreign } = req.body;

    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!name) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await updateRoleQuery(roleId, req.body);
    if (result.rows.length === 0) {
      throw new NotFoundError("Role not found");
    }
    const role = result.rows[0];

    res
      .status(201)
      .json(formatResponse(true, "Role Updated successfully", role));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE ROLE
 * @param req
 * @param res
 * @param next
 */
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = parseInt(req.params.id);

    if (!roleId) {
      throw new BadRequestError("Mising role id");
    }

    const result = await deleteRoleQuery(roleId);

    if (result.rowCount === 0) {
      throw new NotFoundError("Role not found");
    }

    res.json(formatResponse(true, "Role deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

/**
 * ASSIGN ROLE
 * @param req
 * @param res
 * @param next
 */
export const assignRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id, user_ids, ...foreign } = req.body;

    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!role_id || !user_ids || user_ids.length < 1) {
      throw new BadRequestError("Missing required fields");
    }

    const roleExists = await checkRoleExistsQuery(role_id);
    if (!roleExists) {
      throw new NotFoundError("Role not found!");
    }

    const existingUsersCount = await checkUsersExistQuery(user_ids);
    if (existingUsersCount !== user_ids.length) {
      throw new NotFoundError("One or more users not found");
    }

    await assignRoleQuery(role_id, user_ids);

    res.json(formatResponse(true, "Role Assigned successfully", null));
  } catch (error) {
    next(error);
  }
};

/**
 * CLEAR ROLE ASSIGNMENT
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const clearRoleAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role_id } = req.body;

  if (!role_id) {
    throw new BadRequestError("Role ID is required");
  }

  try {
    const roleExists = await checkRoleExistsQuery(role_id);
    if (!roleExists) {
      throw new NotFoundError("Role not found");
    }

    await clearRoleAllocationsQuery(role_id);

    res.json(formatResponse(true, "All Role Assignment cleared!", null));
  } catch (error) {
    next(error);
  }
};

/**
 * CLEAR SPECIFIC ROLE ASSIGNMENT
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const clearSpecificRoleAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role_id, user_id } = req.body;

  if (!role_id || !user_id) {
    throw new BadRequestError("Role and User are required");
  }

  try {
    const roleExists = await checkRoleExistsQuery(role_id);
    if (!roleExists) {
      throw new NotFoundError("Role not found");
    }

    const userExists = await getUserByIdQuery(user_id);
    if (userExists.rows.length < 1) {
      throw new NotFoundError("User not found");
    }

    await clearSpecificRoleAllocationQuery(role_id, user_id);

    res.json(formatResponse(true, "Role Assignment cleared!", null));
  } catch (error) {
    next(error);
  }
};
