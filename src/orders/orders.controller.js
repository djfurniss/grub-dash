const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// this function assigns ID's when necessary
const nextId = require("../utils/nextId");

function list (req, res, next) {
    res.json({data: orders})
};

function create (req, res, next) {
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body
    const newOrder = {
        deliverTo, mobileNumber, status, dishes, id: nextId()
    }
    orders.push(newOrder);
    res.status(201).json({data: newOrder});
};

function read (req, res, next) {
    const { orderId } = req.params
    const foundOrder = orders.find(order => order.id === orderId);
    res.json({data: foundOrder})
};

function update (req, res, next) {
    const { orderId } = req.params
    foundOrder = orders.find(order => order.id === orderId);
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body
    foundOrder = {deliverTo, mobileNumber, status, dishes}
    res.json({data: foundOrder});
};

function destroy (req, res, next) {
    const { orderId } = req.params
    const orderToDel = orders.findIndex(order => order.id === orderId)
    orders.splice(orderToDel, 1);
    res.sendStatus(204);
};

module.exports = {
    list, 
    create, 
    read, 
    update, 
    destroy,
};
