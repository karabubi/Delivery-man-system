// ///Users/salehalkarabubi/works/project/Delivery-man-system/server/util/knexfile.js
// module.exports = {
//     development: {
//       client: 'pg',
//       connection: {
//         host: process.env.POSTGRES_HOST,
//         port: process.env.POSTGRES_PORT,
//         user: process.env.POSTGRES_USER,
//         password: process.env.POSTGRES_PASSWORD,
//         database: process.env.POSTGRES_DATABASE,
//         ssl: process.env.POSTGRES_SSL === "true" && {
//           rejectUnauthorized: false,
//         },
//       },
//       migrations: {
//         directory: '../migrations'
//       },
//       seeds: {
//         directory: '../seeds'
//       }
//     },
  
//     production: {
//       client: 'pg',
//       connection: {
//         host: process.env.POSTGRES_HOST,
//         port: process.env.POSTGRES_PORT,
//         user: process.env.POSTGRES_USER,
//         password: process.env.POSTGRES_PASSWORD,
//         database: process.env.POSTGRES_DATABASE,
//         ssl: process.env.POSTGRES_SSL === "true" && {
//           rejectUnauthorized: false,
//         },
//       },
//       migrations: {
//         directory: './migrations'
//       },
//       seeds: {
//         directory: './seeds'
//       }
//     }
//   };



const useSSL =
  process.env.POSTGRES_SSL === "true" || process.env.NODE_ENV === "production";

const sslConfig = useSSL ? { rejectUnauthorized: false } : false;

const shared = {
  client: "pg",
  migrations: { directory: "../migrations" },
  seeds: { directory: "../seeds" },
};

module.exports = {
  development: {
    ...shared,
    connection: process.env.DATABASE_URL
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
        },
  },

  production: {
    ...shared,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig,
    },
  },
};
