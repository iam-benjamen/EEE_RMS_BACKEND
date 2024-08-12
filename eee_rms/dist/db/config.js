export const databaseType = process.env.DATABASE_DIALECT;
export const connectionOptions = {
    connectionString: process.env.DATABASE_URL,
    database: process.env.DATABASE_NAME,
};
