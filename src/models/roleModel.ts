import { QueryResult } from "pg";
import { pool } from "../db";
import { Role } from "../types/userInterface";
import { RoleInput } from "../types/roleInterface";

/**
 * FETCH ALL ROLES
 */
export const getAllRolesQuery = async (): Promise<Role[]> => {
  const result = await pool.query(`SELECT * FROM roles`);

  return result.rows;
};

/**
 * GET ROLE BASED ON ID
 * @param id
 */
export const getRoleByIdQuery = async (
  id: number
): Promise<QueryResult<any>> => {
  const result = await pool.query("SELECT * FROM roles WHERE id = $1", [id]);
  return result;
};

/**
 * CREATE ROLE
 * @param roleInput
 */
export const createRoleQuery = async (
  roleInput: RoleInput
): Promise<QueryResult<any>> => {
  const { name, description } = roleInput;

  const result = await pool.query(
    `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description]
  );
  return result;
};

/**
 * UPDATE ROLE
 * @param roleInput
 */
export const updateRoleQuery = async (
  id: number,
  roleInput: RoleInput
): Promise<QueryResult<any>> => {
  const { name, description } = roleInput;

  const result = await pool.query(
    `UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description, id]
  );
  return result;
};

/**
 * DELETE ROLE
 */
export const deleteRoleQuery = async (
  id: number
): Promise<QueryResult<any>> => {
  const result = await pool.query("DELETE FROM roles WHERE id = $1", [id]);

  return result;
};

/**
 * ROLE ALLOCATION QUERIES
 */

// Check if course exists
export const checkRoleExistsQuery = async (
  roleId: number
): Promise<boolean> => {
  const result = await pool.query("SELECT id FROM roles WHERE id = $1", [
    roleId,
  ]);
  return result.rows.length > 0;
};

//assign role
export const assignRoleQuery = async (
  roleId: number,
  userIds: number[]
): Promise<void> => {
  await pool.query(
    `
    INSERT INTO user_roles (role_id, user_id)
    SELECT $1, unnest($2::integer[])
    ON CONFLICT (role_id, user_id) DO NOTHING
  `,
    [roleId, userIds]
  );
};

//remove all role assignment completely(no one will be assigned to the role)
export const clearRoleAllocationsQuery = async (
  roleId: number
): Promise<void> => {
  await pool.query("DELETE FROM user_roles WHERE role_id = $1", [roleId]);
};

//clear specific allocation (remove particular user from role)
export const clearSpecificRoleAllocationQuery = async (
  roleId: number,
  userId: number
): Promise<void> => {
  await pool.query(
    "DELETE FROM user_roles WHERE role_id = $1 AND user_id = $2",
    [roleId, userId]
  );
};
