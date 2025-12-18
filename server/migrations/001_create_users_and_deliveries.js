exports.up = async function (knex) {
  // USERS
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) {
    await knex.schema.createTable("users", (table) => {
      // Clerk userId is a string -> store as varchar
      table.string("id", 255).primary();
      table.string("email", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // DELIVERIES
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
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("deliveries");
  await knex.schema.dropTableIfExists("users");
};
