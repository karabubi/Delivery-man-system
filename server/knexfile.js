
///Users/salehalkarabubi/works/project/Delivery-man-system/server/knexfile.js


require("dotenv").config();

const useSSL =
  process.env.POSTGRES_SSL === "true" || process.env.NODE_ENV === "production";

const sslConfig = useSSL ? { rejectUnauthorized: false } : false;

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: sslConfig,
        }
      : {
          host: process.env.POSTGRES_HOST || "localhost",
          port: Number(process.env.POSTGRES_PORT || 5432),
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          ssl: sslConfig,
        },
    migrations: { directory: "./migrations" },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // ✅ correct place
    },
    migrations: { directory: "./migrations" },
  },
};
