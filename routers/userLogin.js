const router = require("express").Router();
const userLogin = require("../controllers/userLogin");

router.post("/login", userLogin);

module.exports = router;