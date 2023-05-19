const express = require('express');
const controllers = require('../controllers/authentication-controllers');

const router = express.Router();


router.get("/login", controllers.getLogin);

router.post("/login", controllers.login);

router.get("/signup", controllers.getSignup);

router.post("/signup", controllers.signup);

router.get("/logout", controllers.logout);

module.exports = router;
