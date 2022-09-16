/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("orders", (table) => {
    table.dropColumn("dish_id")
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("orders", (table) => {
    table.integer("dish_id")
    table.foreign("dish_id")
        .references("dish_id")
        .inTable("dishes")
        .onDelete("cascade")
  })
};
