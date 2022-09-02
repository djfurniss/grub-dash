const router = require("express").Router();
const controller = require("./dishes.controller")

//mouted to "/dishes"
router
    .route("/")
    .get(controller.list) //list
    .post(controller.create) //create
    
router
    .route("/:dishId")
    .get(controller.read) //read
    .put(controller.update) //update
    
module.exports = router;
