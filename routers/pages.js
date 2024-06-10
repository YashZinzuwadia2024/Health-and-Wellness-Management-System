const router = require("express").Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/user-registration", (req, res) => {
    res.render("register");
});  

router.get("/home", authenticateToken, (req, res) => {
    let name = req.user.first_name;
    res.render("home", { name });
});

router.get("/medications", authenticateToken, (req, res) => {
    let name = req.user.first_name;
    res.render("medicationsPage", { name });
});  

router.get("/reports", authenticateToken, (req ,res) => {
    let name = req.user.first_name;
    res.render("reports", { name });
});

module.exports = router;