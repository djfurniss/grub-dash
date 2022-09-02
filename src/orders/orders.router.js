const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//mounted to "/orders"
router
    .route("/")
    .get(controller.list) //list
    .post(controller.create) //create
    .all(methodNotAllowed) //catch all

router
    .route("/:orderId")
    .get(controller.read) //read
    .put(controller.update) //update
    .delete(controller.destroy) //delete
    .all(methodNotAllowed) //catch all

module.exports = router;
