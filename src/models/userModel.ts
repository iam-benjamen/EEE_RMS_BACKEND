import { User, UserInput } from "../types/userInterface";
import { QueryResult } from "pg";
import { pool } from "../db";
import bcrypt from "bcrypt";

/**
 * FETCH ALL USERS
 */
export const getAllUsersQuery = async (): Promise<User[]> => {
  const result = await pool.query(
    `
    SELECT 
      u.id, 
      u.title,
      u.first_name,
      u.last_name,
      u.phone_number,
      u.email,
      COALESCE(json_agg(
        jsonb_build_object(
          'id', r.id,
          'name', r.name
        ) 
      ) FILTER (WHERE r.id IS NOT NULL), '[]') AS roles,
      COALESCE(json_agg(
        jsonb_build_object(
          'id', c.id,
          'course_code', c.course_code,
          'course_title', c.course_title,
          'course_unit', c.course_unit,
          'level', c.level,
          'semester', c.semester,
          'course_type', c.course_type,
          'course_department', c.course_department
        ) 
      ) FILTER (WHERE c.id IS NOT NULL), '[]') AS courses
    FROM 
      users u
    LEFT JOIN 
      user_roles ur ON u.id = ur.user_id
    LEFT JOIN 
      roles r ON ur.role_id = r.id
    LEFT JOIN 
      course_lecturers cl ON u.id = cl.user_id
    LEFT JOIN 
      courses c ON cl.course_id = c.id
    GROUP BY 
      u.id, u.title, u.first_name, u.last_name, u.phone_number, u.email
  `
  );
  return result.rows;
};

/**
 * GET USER BASED ON ID
 * @param id
 */
export const getUserByIdQuery = async (
  id: number
): Promise<QueryResult<any>> => {
  const result = await pool.query(
    `
    SELECT 
      u.id, 
      u.title,
      u.first_name,
      u.last_name,
      u.phone_number,
      u.email,
      COALESCE(json_agg(
        DISTINCT jsonb_build_object(
          'id', r.id,
          'name', r.name
        ) 
      ) FILTER (WHERE r.id IS NOT NULL), '[]') AS roles,
      COALESCE(json_agg(
        DISTINCT jsonb_build_object(
          'id', c.id,
          'course_code', c.course_code,
          'course_title', c.course_title,
          'course_unit', c.course_unit,
          'level', c.level,
          'semester', c.semester,
          'course_type', c.course_type,
          'course_department', c.course_department
        ) 
      ) FILTER (WHERE c.id IS NOT NULL), '[]') AS courses
    FROM 
      users u
    LEFT JOIN 
      user_roles ur ON u.id = ur.user_id
    LEFT JOIN 
      roles r ON ur.role_id = r.id
    LEFT JOIN 
      course_lecturers cl ON u.id = cl.user_id
    LEFT JOIN 
      courses c ON cl.course_id = c.id
    WHERE 
      u.id = $1
    GROUP BY 
      u.id, u.title, u.first_name, u.last_name, u.phone_number, u.email
  `,
    [id]
  );
  return result;
};

/**
 * CREATE USER
 * @param userInput
 */
export const createUserQuery = async (
  userInput: UserInput
): Promise<QueryResult<any>> => {
  const { title, first_name, last_name, email, phone_number, password } =
    userInput;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    `INSERT INTO users (title, first_name, last_name, email, phone_number, password) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, first_name, last_name, email, phone_number, hashedPassword]
  );
  return result;
};

/**
 * UPDATE USER
 * @param id
 * @returns
 */
export const updateUserQuery = async (
  id: number,
  userInput: UserInput
): Promise<QueryResult<any>> => {
  const { title, first_name, last_name, email, phone_number } = userInput;

  const result = await pool.query(
    "UPDATE users SET title = $1, first_name = $2, last_name = $3, email = $4, phone_number = $6 WHERE id = $5 RETURNING id, title, first_name, last_name, email, phone_number",
    [title, first_name, last_name, email, id, phone_number]
  );

  return result;
};

/**
 * DELETE USER
 */
export const deleteUserQuery = async (
  id: number
): Promise<QueryResult<any>> => {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

  return result;
};
