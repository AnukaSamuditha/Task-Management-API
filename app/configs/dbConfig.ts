export default {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "express_postgres",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
  },
};
