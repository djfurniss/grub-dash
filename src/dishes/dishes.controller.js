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
        res.status(400).json({error: `Dish must have a price that is an integer greater than 0`});
    } else next();
};

const idsMatch = (req, res, next) => {//for update if id is in req.body
    const dishId = res.locals.dish.id
    const { data: { id } = {} } = req.body
    //compares the (optional) id the user puts in the req.body with the dishId from res.locals 
    if (id && id === null){//if the id value is null, it can move on to the next piece of middleware because it will not effect the id value in the response
        next();
    } else if (id && id !== dishId){
        //an error only results IF the user provided an id in the request body AND if it doesn't match. All other cases will return the proper id in the response body
        res.status(400).json({error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`});
    } else next();
    //if the user didn't put an id in the body, the request can move on , the id will be returned in the data regardless if they included it or not... but if they do include it, idsMatch makes sure it's consistent with the foundDish from res.locals and does NOT get overwitten
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
    const { data: { name, description, price, image_url } = {} } = req.body
        //reassigns/replaces values as needed, keeping the value of the stored data's id the same. An error only results (prior to this middleware) if the id passed in by the user does not match at all. In ALL other cases, the ORIGINAL id is returned and never overwritten
    foundDish = {id: foundDish.id, name, description, price, image_url}
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
        hasProperty("name"),
        hasProperty("description"),
        hasProperty("price"),
        hasProperty("image_url"),
        hasValidPrice,
        idsMatch, //this piece of middleware makes sure the id cannot be overwitten
        update],
};
