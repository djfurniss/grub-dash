const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// --- HANDLERS --- //
function list () {

};

function create () {

};

function read () {

};

function update () {

};

module.exports = {
    list, 
    create, 
    read, 
    update,
}