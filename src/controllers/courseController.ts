import { NextFunction, Request, Response } from "express";
import {
  allocateCourseQuery,
  checkCourseExistsQuery,
  checkUsersExistQuery,
  clearCourseAllocationsQuery,
  clearSpecificCourseAllocationQuery,
  createCourseQuery,
  deleteCourseQuery,
  getAllCoursesQuery,
  getCourseByIdQuery,
  updateCourseQuery,
} from "../models/courseModel";
import { formatResponse } from "../utils/responseFormatter";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/error";
import { isEmpty } from "../utils/helpers";
import { getUserByIdQuery } from "../models/userModel";

/**
 * FETCH ALL COURSES
 * @param req
 * @param res
 * @param next
 */
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllCoursesQuery();
    res.json(formatResponse(true, "Courses retrieved successfully", result));
  } catch (error) {
    next(error);
  }
};

/**
 * FETCH USER BASED ON ID
 * @param req
 * @param res
 * @param next
 */
export const getSingleCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.id);

    if (!courseId) {
      throw new BadRequestError("Mising course id");
    }

    const result = await getCourseByIdQuery(courseId);

    if (result.rows.length === 0) {
      throw new NotFoundError("Course not found");
    }

    const course = result.rows[0];

    res.json(formatResponse(true, "Course retrieved successfully", course));
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE COURSE
 * @param req
 * @param res
 * @param next
 */
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      course_code,
      course_title,
      course_description,
      course_unit,
      level,
      semester,
      course_type,
      course_department,
      ...foreign
    } = req.body;

    //prevent foreign fields
    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (
      !course_code ||
      !course_title ||
      !course_description ||
      !course_unit ||
      !level ||
      !semester ||
      !course_type ||
      !course_department
    ) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await createCourseQuery(req.body);
    const course = result.rows[0];

    res
      .status(201)
      .json(formatResponse(true, "Course created successfully", course));
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      next(new ConflictError("Course already exists"));
    } else {
      next(error);
    }
  }
};

/**
 * UPDATE COURSE
 * @param req
 * @param res
 * @param next
 */
export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.id);

    if (!courseId) {
      throw new BadRequestError("Missing course id");
    }

    const {
      course_code,
      course_title,
      course_description,
      course_unit,
      level,
      semester,
      course_type,
      course_department,
      ...foreign
    } = req.body;

    //prevent foreign fields
    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (
      !course_code ||
      !course_title ||
      !course_description ||
      !course_unit ||
      !level ||
      !semester ||
      !course_type ||
      !course_department
    ) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await updateCourseQuery(courseId, req.body);
    if (result.rows.length === 0) {
      throw new NotFoundError("Course not found");
    }
    const course = result.rows[0];

    res
      .status(201)
      .json(formatResponse(true, "Course updated successfully", course));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * DELETE COURSE
 * @param req
 * @param res
 * @param next
 */
export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.id);

    if (!courseId) {
      throw new BadRequestError("Mising course id");
    }

    const result = await deleteCourseQuery(courseId);

    if (result.rowCount === 0) {
      throw new NotFoundError("Course not found");
    }

    res.json(formatResponse(true, "Course deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

/**
 * ALLOCATE COURSE
 * @param req
 * @param res
 * @param next
 */
export const allocateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { course_id, user_ids, ...foreign } = req.body;

    if (!isEmpty(foreign)) {
      throw new BadRequestError("foreign field detected");
    }

    if (!course_id || !user_ids || user_ids.length < 1) {
      throw new BadRequestError("Missing required fields");
    }

    const courseExists = await checkCourseExistsQuery(course_id);
    if (!courseExists) {
      throw new NotFoundError("Course not found");
    }

    const existingUsersCount = await checkUsersExistQuery(user_ids);
    if (existingUsersCount !== user_ids.length) {
      throw new NotFoundError("One or more users not found");
    }

    await allocateCourseQuery(course_id, user_ids);

    res.json(formatResponse(true, "Course allocated successfully", null));
  } catch (error) {
    next(error);
  }
};

/**
 * CLEAR COURSE ALLOCATION
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const clearCourseAllocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { course_id } = req.body;

  if (!course_id) {
    throw new BadRequestError("Course ID is required");
  }

  try {
    const courseExists = await checkCourseExistsQuery(course_id);
    if (!courseExists) {
      throw new NotFoundError("Course not found");
    }

    await clearCourseAllocationsQuery(course_id);

    res.json(
      formatResponse(true, "Course allocations cleared successfully", null)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * CLEAR SPECIFIC ALLOCATION
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const clearSpecificCourseAllocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { course_id, user_id } = req.body;

  if (!course_id || !user_id) {
    throw new BadRequestError("Course ID and User ID are required");
  }

  try {
    const courseExists = await checkCourseExistsQuery(course_id);
    if (!courseExists) {
      throw new NotFoundError("Course not found");
    }

    const userExists = await getUserByIdQuery(user_id);
    if (userExists.rows.length < 1) {
      throw new NotFoundError("User not found");
    }

    await clearSpecificCourseAllocationQuery(course_id, user_id);

    res.json(
      formatResponse(true, "Course allocation cleared successfully", null)
    );
  } catch (error) {
    next(error);
  }
};
