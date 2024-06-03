const router = require("express").Router();
const userLogin = require("./userLogin");

router.use("/", userLogin);

module.exports = router;