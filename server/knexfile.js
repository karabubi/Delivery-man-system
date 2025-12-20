// server/knexfile.js
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : {
          host: process.env.POSTGRES_HOST || "localhost",
          port: Number(process.env.POSTGRES_PORT || 5432),
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
        },
    migrations: {
      directory: "./migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
    },
    ssl: { rejectUnauthorized: false }, // required on Render
  },
};
