/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  //ENUM type for roles
  pgm.createType("role", [
    "departmental_lecturer",
    "level_coordinator",
    "super_admin",
  ]);

  // Create the users table
  pgm.createTable("users", {
    id: "id",
    title: { type: "varchar(10)", notNull: true },
    first_name: { type: "varchar(100)", notNull: true },
    last_name: { type: "varchar(100)", notNull: true },
    email: { type: "varchar(100)", notNull: true, unique: true },
    password: { type: "varchar(100)", notNull: true },
    roles: { type: "role[]", notNull: true }, // Array of ENUM roles
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("users");
  pgm.dropType("role");
};
