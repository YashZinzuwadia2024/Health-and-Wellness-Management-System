const router = require("express").Router();
const pages = require("./pages");
const auth = require("./auth");

router.use("/", pages);
router.use("/", auth);

module.exports = router;