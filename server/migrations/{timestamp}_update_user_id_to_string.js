// ///Users/salehalkarabubi/works/project/Delivery-man-system/server/migrations
// exports.up = async function(knex) {
//   // Drop foreign key constraint on user_id in deliveries table
//   await knex.schema.alterTable('deliveries', function(table) {
//     table.dropForeign('user_id');
//   });

//   // Convert id column in users table to VARCHAR(255)
//   await knex.schema.alterTable('users', function(table) {
//     table.string('id', 255).alter();
//   });

//   // Convert user_id column in deliveries table to VARCHAR(255)
//   await knex.schema.alterTable('deliveries', function(table) {
//     table.string('user_id', 255).alter();
//   });

//   // Recreate foreign key constraint on user_id in deliveries table
//   await knex.schema.alterTable('deliveries', function(table) {
//     table.foreign('user_id').references('users.id');
//   });
// };

// exports.down = async function(knex) {
//   // Drop foreign key constraint on user_id in deliveries table
//   await knex.schema.alterTable('deliveries', function(table) {
//     table.dropForeign('user_id');
//   });

//   // Convert user_id column in deliveries table back to INTEGER
//   await knex.schema.alterTable('deliveries', function(table) {
//     table.integer('user_id').alter();
//   });

//   // Convert id column in users table back to INTEGER
//   await knex.schema.alterTable('users', function(table) {
//     table.integer('id').alter();
//   });

//   // Recreate foreign key constraint on user_id in deliveries table
//   await knex.schema.alterTable('deliveries', function(table) {
//     table.foreign('user_id').references('users.id');
//   });
// };  


// migrations/{timestamp}_update_user_id_to_string.js

exports.up = async function (knex) {
  // Postgres primary key columns must stay NOT NULL.
  // We only ensure the id column is VARCHAR(255) and keep NOT NULL.
  await knex.schema.alterTable("users", (table) => {
    table.string("id", 255).notNullable().alter();
  });
};

exports.down = async function (knex) {
  // rollback not needed for now
};
