const router = require("express").Router();
const controller = require("./orders.controller")

//mounted to "/orders"
router
    .route("/")
    .get(controller.list) //list
    .post(controller.create) //create

router
    .route("/:orderId")
    .get(controller.read) //read
    .put(controller.update) //update
    .delete(controller.destroy) //delete

module.exports = router;
