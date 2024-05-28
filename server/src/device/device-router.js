const express = require("express");
const deviceController = require("./device-controller");
const router = express.Router();

//get
router.get("/", deviceController.getAllDevices);

//post
router.post("/", deviceController.createDevice);

//put
router.put("/:id", deviceController.updateDevice);
module.exports = router;
