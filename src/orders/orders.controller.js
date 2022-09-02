const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// this function assigns ID's when necessary
const nextId = require("../utils/nextId");

function list (req, res, next) {
    res.json({data: orders})
};

function create (req, res, next) {

};

function read (req, res, next) {
    const { orderId } = req.params
};

function update (req, res, next) {

};

function destroy (req, res, next) {

};

module.exports = {
    list, 
    create, 
    read, 
    update, 
    destroy,
};
