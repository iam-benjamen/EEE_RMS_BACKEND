import { QueryResult } from "pg";
import { pool } from "../db";
import { User } from "../types/userInterface";

/**
 * FETCH ALL USERS
 */
export const getUserByEmailQuery = async (
  email: string
): Promise<QueryResult<any>> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result;
};
