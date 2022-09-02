const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//mounted to "/dishes"
router
    .route("/")
    .get(controller.list) //list
    .post(controller.create) //create
    .all(methodNotAllowed) //catch all
    
router
    .route("/:dishId")
    .get(controller.read) //read
    .put(controller.update) //update
    .all(methodNotAllowed) //catch all
    
module.exports = router;
