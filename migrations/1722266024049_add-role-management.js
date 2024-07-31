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
  // Create roles table
  pgm.createTable("roles", {
    id: "id",
    name: { type: "varchar(50)", notNull: true, unique: true },
    description: { type: "text" },
  });

  // Create user_roles junction table
  pgm.createTable("user_roles", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    role_id: {
      type: "integer",
      notNull: true,
      references: '"roles"',
      onDelete: "CASCADE",
    },
  });

  // Add unique constraint to prevent duplicate user-role assignments
  pgm.addConstraint("user_roles", "user_role_unique", {
    unique: ["user_id", "role_id"],
  });

  // Create index on user_id for faster lookups
  pgm.createIndex("user_roles", "user_id");

  // Create index on role_id for faster lookups
  pgm.createIndex("user_roles", "role_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop tables
  pgm.dropTable("user_roles");
  pgm.dropTable("roles");
};
