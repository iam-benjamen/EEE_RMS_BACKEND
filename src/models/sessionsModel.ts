import { QueryResult } from "pg";
import { Session } from "../types/sessionInterface";
import { pool } from "../db";

/**
 * GET ALL SESSIONS
 */
export const getAllSessionsQuery = async (): Promise<Session[]> => {
  const result = await pool.query("SELECT * FROM sessions ORDER BY date DESC");
  return result.rows;
};

/**
 * CREATE SESSION
 * @param date
 * @param current
 * @returns
 */
export const createSessionQuery = async (
  date: string,
  current: boolean
): Promise<QueryResult<Session>> => {
  const result = await pool.query(
    "INSERT INTO sessions (date, current) VALUES ($1, $2) RETURNING *",
    [date, current]
  );

  return result;
};

/**
 * SESSION BY ID
 */

export const getSessionByIdQuery = async (
  id: number
): Promise<QueryResult<Session>> => {
  const result = await pool.query("SELECT * FROM sessions WHERE id = $1", [id]);

  return result;
};

/**
 * SET SESSION TO CURRENT
 */
