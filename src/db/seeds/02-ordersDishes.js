/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const ordersDishes = require("../fixtures/ordersDishes")

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.raw("TRUNCATE TABLE orders_dishes CASCADE")
  return await knex('orders_dishes').insert(ordersDishes);
};
