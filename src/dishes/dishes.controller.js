const path = require("path");

// --- DATA ---
const dishes = require(path.resolve("src/data/dishes-data"));

// this function assigns ID's when necessary
const nextId = require("../utils/nextId");
 
// --- VALIDATION ---
const dishExists = (req, res, next) => {
    const { dishId } = req.params
    const foundDish = dishes.find(dish => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish
        //from this validation onward, the response will have access to this particular dish from the locals object without having to perform dishes.find() again
        next();
    }else{
        next({status: 404, message: `dish ID: ${dishId} does not exist`});
    };
};

const hasProperty = (property) => { //for create and update, individual properties are passed
    // returning this functions ensures that the request can be passed through
    return function (req, res, next){
        const { data = {} } = req.body
        //checks to make sure the data object is not missing a given property 
        if (!data[property]) { //runs true also for empty strings
            res.status(400).json({error:`Dish must include a ${property}`});
        } else next();
    };
};

const hasValidPrice = (req, res, next) => { //for create and update
    const { data: { price } = {} } = req.body
    if (price < 0 || !Number.isInteger(price)){//price needs to be an integer greater than 0
        res.status(400).json({error: `Dish must have a price that is an integer greater than 0`})
    } else next();
};

const idsMatch = (req, res, next) => {//for update if id is in req.body
    const { dishId } = req.params;
    const {data: {id} = {} } = req.body
    //compares the (optional) id the user puts in the req.body with the dishId paramteter 
    if (id && id !== dishId){
        res.status(400).json({error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`});
    } else next();
    //if the user didn't put an id in the body, the request can move on , the id will be returned in the data regardless if they included it or not... but if they do include it, idsMatch makes sure it's consistent with the foundDish
};

// --- HANDLERS ---
function list (req, res) {res.json({data: dishes})};

function create (req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body
    const newDish = {
        id: nextId(), 
        name, description, price, image_url
    };
    dishes.push(newDish);
    res.status(201).json({data: newDish});
};

function read (req, res) {
    const foundDish = res.locals.dish //assigned from dishExists validation
    res.json({data: foundDish});
};

function update (req, res) {
    let foundDish = res.locals.dish //assigned from dishExists validation
    const { dishId } = req.params
    const { data: { name, description, price, image_url } = {} } = req.body
        //reassigns/replaces values as needed, keeping the id the same
    foundDish = {id: dishId, name, description, price, image_url}
    res.json({data: foundDish});
};

module.exports = {
    list, 
    create: [
        hasProperty("name"),
        hasProperty("description"),
        hasProperty("price"),
        hasProperty("image_url"),
        hasValidPrice,
        create
    ], 
    read: [dishExists, read], 
    update: [
        dishExists,
        idsMatch, 
        hasProperty("name"),
        hasProperty("description"),
        hasProperty("price"),
        hasProperty("image_url"),
        hasValidPrice,
        update],
};
