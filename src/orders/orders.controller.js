const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// this function assigns ID's when necessary
const nextId = require("../utils/nextId");

// --- VALIDATION ---
const orderExists = (req, res, next) => {
    const { orderId } = req.params
    const foundOrder = orders.find(order => order.id === orderId)
    if (!foundOrder){
        next({status: 404, message: `order ID : ${orderId} does not exist`})
    } else {
        res.locals.order = foundOrder
        next()
    };
};

const hasProperty = (property) => {
    return function (req, res, next) {
        const {data = {} } = req.body
        if(!data[property]){
            res.status(400).json({error: `Order must include a ${property}`})
        } else next();
    };
};

const hasValidDishes = (req, res, next) => {
    const { data: { dishes } = {} } = req.body
    if (!Array.isArray(dishes) || !dishes.length){
        res.status(400).json({error: 'Order must include at least one dish'})
    } else next();
};

const hasValidStatus = (req, res, next) => {
    const { data: {status} = {} } = req.body
    if(!status || status == "invalid"){
        res.status(400).json({error: `Order must have a status of pending, preparing, out-for-delivery, delivered`})
    }else if (status == "delivered"){
        res.status(400).json({error: 'A delivered order cannot be changed'})
    }else next();
};

const orderPending = (req, res, next) => {
    const order = res.locals.order
    if (order.status !== "pending"){
        res.status(400).json({error: "An order cannot be deleted unless it is pending"})
    }else next();
};

const dishHasQuantity = (req, res, next) => {
    const { data: { dishes } = {} } = req.body
    dishes.forEach((dish, index)=>{
        if(!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)){
        res.status(400).json({error: `Dish ${index} must have a quantity that is an integer greater than 0`})
        };
    })
    return next();
};

const idsMatch = (req, res,next) => {
    const { orderId } = req.params;
    const {data: {id} = {} } = req.body
    if (id && orderId !== id){
        res.status(400).json({error: `Order id does not match route id. Order: ${id}, Route: ${orderId}`})
    } else next();
};

// --- HANDLERS ---
function list (req, res, next) {
    res.json({data: orders})
};

function create (req, res, next) {
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body
    const newOrder = {
        id: nextId(), 
        deliverTo, mobileNumber, status, dishes
    }
    orders.push(newOrder);
    res.status(201).json({data: newOrder});
};

function read (req, res, next) {
    const foundOrder = res.locals.order
    res.json({data: foundOrder})
};

function update (req, res, next) {
    foundOrder = res.locals.order
    const { orderId } = req.params
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body
    foundOrder = {deliverTo, mobileNumber, status, dishes, id: orderId}
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
    create: [
        hasProperty("deliverTo"),
        hasProperty("mobileNumber"),
        hasProperty("dishes"),
        hasValidDishes,
        dishHasQuantity,
        create
    ], 
    read: [
        orderExists,
        read
    ], 
    update: [
        orderExists,
        hasProperty("deliverTo"),
        hasProperty("mobileNumber"),
        hasProperty("dishes"),
        hasValidStatus,
        hasValidDishes,
        dishHasQuantity,
        idsMatch,
        update
    ], 
    destroy: [
        orderExists,
        orderPending,
        destroy
    ],
};
