/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const dishes = require("../fixtures/dishes")

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.raw("TRUNCATE TABLE dishes RESTART IDENTITY CASCADE")
  return await knex('dishes').insert(dishes);
};
