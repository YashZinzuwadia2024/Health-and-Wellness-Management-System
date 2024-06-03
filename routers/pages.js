const router = require("express").Router();
const sessionChecker = require("../middlewares/validateUser");

router.get("/", (req, res) => {
    res.render("login");
});
router.get("/home", sessionChecker, (req, res) => {
    let name = req.session.profile.first_name;
    res.render("home", { name });
});

module.exports = router;