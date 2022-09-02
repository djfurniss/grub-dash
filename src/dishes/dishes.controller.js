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
        next();
    }else{
        next({status: 404, message: `dish ID: ${dishId} does not exist`});
    };
};

const hasProperty = (property) => { //for create and update
    return function (req, res, next){
        const {data = {}} = req.body
        if (!data[property]) { //runs for empty name, desc, and image_url strings
            res.status(400).json({error:`Dish must include a ${property}`});
        } else next();
    };
};

const hasValidPrice = (req, res, next) => {
    const {data: { price } = {}} = req.body
    if (price <= 0 || !Number.isInteger(price)){
        res.status(400).json({error: `Dish must have a price that is an integer greater than 0`})
    } else next();
};

const idsMatch = (req, res, next) => {
    const { dishId } = req.params;
    const {data: {id} = {} } = req.body
    if (dishId !== id){
        res.status(404).json({error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`})
    } else next();
};

// --- HANDLERS ---
function list (req, res, next) {
    res.json({data: dishes})
};

function create (req, res, next) {
    const {data: {name, description, price, image_url} = {}} = req.body
    //TODO: make sure all ^ data is valid
    const newDish = {
        id: nextId(), 
        name,
        description,
        price, 
        image_url
    };
    dishes.push(newDish)
    res.status(201).json({data: newDish})
};

function read (req, res, next) {
    res.json({data: res.locals.dish})
};

function update (req, res, next) {
    foundDish = res.locals.dish
    const {data: {name, description, price, image_url} = {}} = req.body
    foundDish = {name, description, price, image_url}
    res.json({data: foundDish})
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
