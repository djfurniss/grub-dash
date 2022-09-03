const path = require("path");

// --- DATA ---
const orders = require(path.resolve("src/data/orders-data"));

// this function assigns ID's when necessary
const nextId = require("../utils/nextId");

// --- VALIDATION ---
const orderExists = (req, res, next) => {
    const { orderId } = req.params
    const foundOrder = orders.find(order => order.id === orderId);
    if (foundOrder){
        res.locals.order = foundOrder
        //from this validation onward, the response will have access to this particular order from the locals object without having to perform orders.find() again
        next();
    } else {
        next({status: 404, message: `order ID : ${orderId} does not exist`});
    };
};

const hasProperty = (property) => { //for create and update, individual properties are passed
    // returning this functions ensures that the request can be passed through
    return function (req, res, next) {
        const { data = {} } = req.body
        //checks to make sure the data object is not missing a given property 
        if(!data[property]){ //runs true also for empty strings
            res.status(400).json({error: `Order must include a ${property}`});
        } else next();
    };
};

const hasValidDishes = (req, res, next) => { //for create and update
    const { data: { dishes } = {} } = req.body
    if (!Array.isArray(dishes) || !dishes.length){ //if dishes is not an arr or has nothing in it
        res.status(400).json({error: 'Order must include at least one dish'});
    } else next();
};

const hasValidStatus = (req, res, next) => { //specifically for update
    const { data: { status } = {} } = req.body
    if(!status || status == "invalid"){ //no status property at all, an empty string, or "invalid"
        res.status(400).json({error: `Order must have a status of pending, preparing, out-for-delivery, delivered`});
    }else if (status == "delivered"){ //if an order is already delivered, it cannot be updated
        res.status(400).json({error: 'A delivered order cannot be changed'});
    }else next();
};

const orderPending = (req, res, next) => { //specifically for delete
    const order = res.locals.order //assigned from orderExists validation
    if (order.status !== "pending"){
        res.status(400).json({error: "An order cannot be deleted unless it is pending"});
    }else next();
};

const dishHasQuantity = (req, res, next) => {//after making sure dishes is an arr and has at least one dish, checks quantity
    const { data: { dishes } = {} } = req.body
    dishes.forEach((dish, index)=>{
        if(!dish.quantity || dish.quantity < 0 || !Number.isInteger(dish.quantity)){//if quantity property is missing, less than 0, or isn't an integer
        res.status(400).json({error: `Dish ${index} must have a quantity that is an integer greater than 0`});
        };
    })
    next();
};

const idsMatch = (req, res,next) => {//for update if id is in req.body
    const orderId = res.locals.order.id
    const { data: { id } = {} } = req.body
    //compares the (optional) id the user puts in the req.body with the orderId from res.locals
    if (id && id === null){
        next();
    } else if (id && orderId !== id){
        res.status(400).json({error: `Order id does not match route id. Order: ${id}, Route: ${orderId}`});
    } else next();
    //if the user didn't put an id in the body, the request can move on , the id will be returned in the data regardless if they included it or not... but if they do include it, idsMatch makes sure it's consistent with the foundOrder from req.locals and does NOT get overwitten
};

// --- HANDLERS ---
function list (req, res) {res.json({data: orders})};

function create (req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body
    const newOrder = {
        id: nextId(), 
        deliverTo, mobileNumber, status, dishes
    }
    orders.push(newOrder);
    res.status(201).json({data: newOrder});
};

function read (req, res) {
    const foundOrder = res.locals.order //assigned from orderExists validation
    res.json({data: foundOrder});
};

function update (req, res) {
    let foundOrder = res.locals.order //assigned from orderExists validation
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body
        //reassigns/replaces values as needed, keeping the id the same
    foundOrder = {id: foundOrder.id, deliverTo, mobileNumber, status, dishes}
    res.json({data: foundOrder});
};

function destroy (req, res) {
    const orderId = res.locals.order.id
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
