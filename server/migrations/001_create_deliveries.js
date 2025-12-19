// server/migrations/001_create_deliveries.js
exports.up = async function (knex) {
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) {
    // Optional: create users table if your app needs it.
    await knex.schema.createTable("users", (table) => {
      table.string("id", 255).primary(); // Clerk user id
      table.timestamps(true, true);
    });
  }

  const hasDeliveries = await knex.schema.hasTable("deliveries");
  if (!hasDeliveries) {
    await knex.schema.createTable("deliveries", (table) => {
      table.increments("id").primary();
      table.string("user_id", 255).notNullable();
      table.text("address").notNullable();
      table.decimal("position_latitude", 10, 7).notNullable();
      table.decimal("position_longitude", 10, 7).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());

      table
        .foreign("user_id")
        .references("users.id")
        .onDelete("CASCADE");

      table.index(["user_id"]);
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("deliveries");
};
