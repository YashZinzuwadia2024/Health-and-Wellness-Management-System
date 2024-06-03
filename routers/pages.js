const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("login");
});
router.get("/home", (req, res) => {
    let name = req.session.profile.first_name;
    res.render("home", { name });
});

module.exports = router;