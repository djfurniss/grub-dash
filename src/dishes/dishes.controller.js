const path = require("path");

// --- DATA ---
const dishes = require(path.resolve("src/data/dishes-data"));

// this function assigns ID's when necessary
const nextId = require("../utils/nextId");

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
    const { dishId } = req.params
    const foundDish = dishes.find(dish => dish.id === dishId)
    res.json({data: foundDish})
};

function update (req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === dishId)
    const {data: {name, description, price, image_url} = {}} = req.body
    foundDish.name = name
    foundDish.description = description
    foundDish.price = price
    foundDish.image_url = image_url
    res.json({data: foundDish})
};

module.exports = {
    list, 
    create, 
    read, 
    update,
};
