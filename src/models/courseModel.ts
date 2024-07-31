import { QueryResult } from "pg";
import { pool } from "../db";
import { Course, courseInput } from "../types/courseInterface";

/**
 * FETCH ALL COURSES
 */
export const getAllCoursesQuery = async (): Promise<Course[]> => {
  const result = await pool.query(
    `SELECT 
      c.id, 
      c.course_code, 
      c.course_title, 
      c.course_description, 
      c.course_unit, 
      c.level, 
      c.semester,
      c.course_type,
      c.course_department,
      COALESCE(json_agg(
        json_build_object(
          'id', u.id,
          'title', u.title,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'phone_number', u.phone_number,
          'email', u.email
        ) 
      ) FILTER (WHERE u.id IS NOT NULL), '[]') AS lecturers
    FROM 
      courses c
    LEFT JOIN 
      course_lecturers cl ON c.id = cl.course_id
    LEFT JOIN 
      users u ON cl.user_id = u.id
    GROUP BY 
      c.id, c.course_code, c.course_title, c.course_description, c.course_unit, c.level, c.semester, c.course_type, c.course_department`
  );
  return result.rows;
};

/**
 * GET COURSE BASED ON ID
 * @param id
 */
export const getCourseByIdQuery = async (
  id: number
): Promise<QueryResult<any>> => {
  const result = await pool.query(
    "SELECT id, course_code, course_title, course_description, course_unit, level, semester, course_type, course_department FROM courses WHERE id = $1",
    [id]
  );
  return result;
};

/**
 * CREATE Course
 * @param courseInput
 */
export const createCourseQuery = async (
  courseInput: courseInput
): Promise<QueryResult<any>> => {
  const {
    course_code,
    course_title,
    course_description,
    course_unit,
    level,
    semester,
    course_type,
    course_department,
  } = courseInput;

  const result = await pool.query(
    `INSERT INTO courses (course_code, course_title, course_description, course_unit, level, semester, course_type, course_department) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      course_code,
      course_title,
      course_description,
      course_unit,
      level,
      semester,
      course_type,
      course_department,
    ]
  );
  return result;
};

/**
 * UPDATE COURSE
 * @param id
 * @returns
 */
export const updateCourseQuery = async (
  courseId: number,
  courseInput: courseInput
): Promise<QueryResult<any>> => {
  const {
    course_code,
    course_department,
    course_description,
    course_title,
    course_type,
    course_unit,
    level,
    semester,
  } = courseInput;

  const result = await pool.query(
    "UPDATE courses SET course_code = $1, course_department = $2, course_description = $3, course_title = $4, course_type = $5, course_unit = $6, level = $7, semester = $8 WHERE id = $9 RETURNING *",
    [
      course_code,
      course_department,
      course_description,
      course_title,
      course_type,
      course_unit,
      level,
      semester,
      courseId,
    ]
  );

  return result;
};

/**
 * DELETE COURSE
 */

export const deleteCourseQuery = async (
  courseId: number
): Promise<QueryResult<any>> => {
  const result = await pool.query("DELETE FROM courses WHERE id = $1", [
    courseId,
  ]);

  return result;
};


/**
 * COURSE ALLOCATION QUERIES
 */

// Check if course exists
export const checkCourseExistsQuery = async (
  courseId: number
): Promise<boolean> => {
  const result = await pool.query("SELECT id FROM courses WHERE id = $1", [
    courseId,
  ]);
  return result.rows.length > 0;
};

// Check array of users exist
export const checkUsersExistQuery = async (
  userIds: number[]
): Promise<number> => {
  const result = await pool.query(
    "SELECT COUNT(id) FROM users WHERE id = ANY($1)",
    [userIds]
  );
  return parseInt(result.rows[0].count);
};

//allocate course
export const allocateCourseQuery = async (
  courseId: number,
  userIds: number[]
): Promise<void> => {
  await pool.query(
    `
    INSERT INTO course_lecturers (course_id, user_id)
    SELECT $1, unnest($2::integer[])
    ON CONFLICT (course_id, user_id) DO NOTHING
  `,
    [courseId, userIds]
  );
};


//clear all course allocation (no one will be allocated the course)
export const clearCourseAllocationsQuery = async (
  courseId: number
): Promise<void> => {
  await pool.query("DELETE FROM course_lecturers WHERE course_id = $1", [
    courseId,
  ]);
};

//clear specific allocation(remove particular user from the course)
export const clearSpecificCourseAllocationQuery = async (
  courseId: number,
  userId: number
): Promise<void> => {
  await pool.query(
    "DELETE FROM course_lecturers WHERE course_id = $1 AND user_id = $2",
    [courseId, userId]
  );
};