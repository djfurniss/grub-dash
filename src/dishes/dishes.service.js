const knex = require("../db/connection")

function list () {
    return knex("dishes")
        .select("*")
}

function create(newDish) {
    return knex("dishes").insert(newDish)
    .returning("*")
    .then(newDish => newDish[0])
}

module.exports = {
    list,
    create
}