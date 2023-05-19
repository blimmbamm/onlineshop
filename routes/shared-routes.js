const express = require("express");
const controllers = require("../controllers/shared-controllers");

const router = express.Router();

router.get("/success", controllers.getSuccessPage);

router.get("/about", controllers.getAbout);

module.exports = router;