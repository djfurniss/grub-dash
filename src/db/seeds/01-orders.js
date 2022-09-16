/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const orders = require("../fixtures/orders")

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.raw("TRUNCATE TABLE orders RESTART IDENTITY CASCADE")
  return await knex('orders').insert(orders);
};
