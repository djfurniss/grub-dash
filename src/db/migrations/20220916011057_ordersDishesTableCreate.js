/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("orders_dishes", (table) => {
    table.integer("order_id").unsigned().notNullable()
    table.foreign("order_id")
        .references("order_id")
        .inTable("orders")
        .onDelete("cascade")
    table.integer("dish_id").unsigned().notNullable()
    table.foreign("dish_id")
        .references("dish_id")
        .inTable("dishes")
        .onDelete("cascade")
    table.integer("quantity").unsigned().defaultTo(1)
    table.primary(["order_id", "dish_id"])
    table.timestamps(true, true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("orders_dishes")
};
