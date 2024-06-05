const router = require("express").Router();
const sessionChecker = require("../middlewares/validateUser");
const db = require("../models/index");

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/home", sessionChecker, (req, res) => {
    let name = req.session.profile.first_name;
    res.render("home", { name });
});

router.get("/medications", sessionChecker, async (req, res) => {
    let name = req.session.profile.first_name;
    res.render("medicationsPage", { name });
});  

module.exports = router;