/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments("order_id").primary()
    table.string("deliver_to")
    table.string("mobile_number")
    table.string("status")
    table.integer("dish_id").unsigned().notNullable()
    table.foreign("dish_id")
        .references("dish_id")
        .inTable("dishes")
        .onDelete("cascade")
    table.timestamps(true, true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("orders")
};
