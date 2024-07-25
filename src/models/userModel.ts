import { User, UserInput } from "../types/userInterface";
import { QueryResult } from "pg";
import { pool } from "../db";
import bcrypt from "bcrypt";

/**
 * FETCH ALL USERS
 */
export const getAllUsersQuery = async (): Promise<User[]> => {
  const result = await pool.query(
    "SELECT id, title, first_name, last_name, email, roles FROM users"
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
    "SELECT id, title, first_name, last_name, email, roles FROM users WHERE id = $1",
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
  const { title, first_name, last_name, email, password, roles } = userInput;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    `INSERT INTO users (title, first_name, last_name, email, password, roles) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, first_name, last_name, email, hashedPassword, roles]
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
  const { title, first_name, last_name, email, roles } = userInput;

  const result = await pool.query(
    "UPDATE users SET title = $1, first_name = $2, last_name = $3, email = $4, roles = $5 WHERE id = $6 RETURNING id, title, first_name, last_name, email, roles",
    [title, first_name, last_name, email, roles, id]
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
