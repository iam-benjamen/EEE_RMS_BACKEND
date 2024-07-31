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
  pgm.createTable("courses", {
    id: "id",
    course_code: { type: "varchar(20)", notNull: true, unique: true },
    course_title: { type: "varchar(255)", notNull: true },
    course_description: { type: "text" },
    course_unit: { type: "integer", notNull: true },
    level: { type: "integer", notNull: true },
    semester: { type: "varchar(20)", notNull: true },
  });

  pgm.createTable("course_lecturers", {
    id: "id",
    course_id: { type: "integer", notNull: true },
    user_id: { type: "integer", notNull: true },
  });

  // Add a unique constraint to prevent duplicate entries
  pgm.addConstraint("course_lecturers", "unique_course_lecturer", {
    unique: ["course_id", "user_id"],
  });

  // Add foreign key constraints
  pgm.addConstraint("course_lecturers", "fk_course_lecturers_course", {
    foreignKeys: {
      columns: "course_id",
      references: "courses(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("course_lecturers", "fk_course_lecturers_user", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("courses");
  pgm.dropTable("course_lecturers")
  pgm.dropConstraint("unique_course_lecturer");
  pgm.dropConstraint("fk_course_lecturers_course");
  pgm.dropConstraint("fk_course_lecturers_user");
};
