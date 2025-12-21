// ///Users/salehalkarabubi/works/project/Delivery-man-system/server/util/db-connect.js
// const knex = require("knex");
// const knexConfig = require("./knexfile");

// const db = knex({
//   client: "pg",
//   connection: {
//     host: process.env.POSTGRES_HOST,
//     port: process.env.POSTGRES_PORT,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DATABASE,
//     ssl: process.env.POSTGRES_SSL === "true" && {
//       rejectUnauthorized: false,
//     },
//   },
// });

// module.exports = db;

///Users/salehalkarabubi/works/project/Delivery-man-system/server/util/db-connect.js

const knex = require("knex");

// Render/Production typically requires SSL
const useSSL =
  process.env.POSTGRES_SSL === "true" || process.env.NODE_ENV === "production";

const sslConfig = useSSL ? { rejectUnauthorized: false } : false;

// Prefer DATABASE_URL if provided (Render Postgres)
const connection = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig,
    }
  : {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT || 5432),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD || undefined,
      database: process.env.POSTGRES_DATABASE,
      ssl: sslConfig,
    };

const db = knex({
  client: "pg",
  connection,
  pool: { min: 0, max: 10 },
});

module.exports = db;
