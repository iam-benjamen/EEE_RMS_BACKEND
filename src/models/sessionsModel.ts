import { QueryResult } from "pg";
import { Session } from "../types/sessionInterface";
import { pool } from "../db";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/error";

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
 * GET CURRENT SESSION
 */
export const getCurrentSessionQuery = async (): Promise<
  QueryResult<Session>
> => {
  const result = await pool.query(
    "SELECT * FROM sessions WHERE current = true LIMIT 1"
  );

  return result;
};

/**
 * DELETE SESSION
 * @param id
 * @returns
 */

export const deleteSessionQuery = async (
  id: number
): Promise<QueryResult<any>> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    //look for specified session
    const checkResult = await client.query(
      "SELECT current FROM sessions WHERE id = $1",
      [id]
    );

    //session not found
    if (checkResult.rows.length === 0) {
      await client.query("ROLLBACK");
      throw new NotFoundError("Session not found");
    }

    // session is current, cannot delete
    if (checkResult.rows[0].current) {
      await client.query("ROLLBACK");
      throw new ForbiddenError("Cannot delete current session");
    }

    // If not current, proceed with deletion
    const deleteResult = await client.query(
      "DELETE FROM sessions WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");
    return deleteResult;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * SET SESSION TO CURRENT
 */
export const setSesssionAsCurrentQuery = async (
  id: number
): Promise<QueryResult<Session>> => {
  const client = await pool.connect();
  try {
    //begin database transaction
    await client.query("BEGIN");

    //set any previous current to false
    await client.query(
      "UPDATE sessions SET current = false WHERE current = true"
    );

    const result = await client.query(
      "UPDATE sessions SET current = true WHERE id = $1 RETURNING *",
      [id]
    );

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
