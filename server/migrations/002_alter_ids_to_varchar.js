// exports.up = async function (knex) {
//   const hasUsers = await knex.schema.hasTable("users");
//   const hasDeliveries = await knex.schema.hasTable("deliveries");

//   if (!hasUsers || !hasDeliveries) {
//     console.log("Skipping migration: tables do not exist");
//     return;
//   }

//   // Drop FK only if it exists
//   const fkExists = await knex.raw(`
//     SELECT 1
//     FROM information_schema.table_constraints
//     WHERE constraint_type = 'FOREIGN KEY'
//       AND table_name = 'deliveries'
//       AND constraint_name = 'deliveries_user_id_foreign'
//   `);

//   if (fkExists.rowCount > 0) {
//     await knex.schema.alterTable("deliveries", (table) => {
//       table.dropForeign("user_id");
//     });
//   }

//   // Ensure users.id is VARCHAR
//   await knex.schema.alterTable("users", (table) => {
//     table.string("id", 255).alter();
//   });

//   // Ensure deliveries.user_id is VARCHAR
//   await knex.schema.alterTable("deliveries", (table) => {
//     table.string("user_id", 255).alter();
//   });

//   // Recreate FK (safe)
//   await knex.schema.alterTable("deliveries", (table) => {
//     table
//       .foreign("user_id")
//       .references("users.id")
//       .onDelete("CASCADE");
//   });
// };

// exports.down = async function () {
//   // No down migration for Clerk user IDs (string-based)
// };


/**
 * Migration: 002_alter_ids_to_varchar
 *
 * Purpose:
 * --------
 * Ensure Clerk-compatible string-based user IDs without
 * breaking existing databases.
 *
 * This migration is DEFENSIVE:
 * - It only runs when tables exist
 * - It never alters PRIMARY KEY constraints
 * - It never drops foreign keys unless they exist
 *
 * Safe for:
 * - Local development
 * - Render production
 * - Existing databases with data
 */

exports.up = async function (knex) {
  const hasUsers = await knex.schema.hasTable("users");
  const hasDeliveries = await knex.schema.hasTable("deliveries");

  // If tables do not exist, do nothing
  if (!hasUsers || !hasDeliveries) {
    console.log(
      "[migration] Skipping 002_alter_ids_to_varchar — tables do not exist"
    );
    return;
  }

  // Check if the foreign key constraint exists
  const fkResult = await knex.raw(`
    SELECT constraint_name
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
      AND table_name = 'deliveries'
      AND constraint_name = 'deliveries_user_id_foreign'
  `);

  // Drop foreign key ONLY if it exists
  if (fkResult.rowCount > 0) {
    await knex.schema.alterTable("deliveries", (table) => {
      table.dropForeign("user_id");
    });
  }

  // IMPORTANT:
  // Do NOT alter users.id if it is already a PRIMARY KEY.
  // PostgreSQL does not allow altering PK columns safely.
  // Clerk IDs are already strings, so no change is required.

  // Ensure deliveries.user_id is VARCHAR (safe operation)
  await knex.schema.alterTable("deliveries", (table) => {
    table.string("user_id", 255).notNullable().alter();
  });

  // Re-create foreign key safely
  await knex.schema.alterTable("deliveries", (table) => {
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE");
  });

  console.log(
    "[migration] 002_alter_ids_to_varchar completed successfully"
  );
};

exports.down = async function () {
  // No rollback required.
  // Clerk user IDs must remain string-based.
};
