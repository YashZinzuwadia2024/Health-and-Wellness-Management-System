const router = require("express").Router();
const pages = require("./pages");
const auth = require("./auth");
const medications = require("./medications");

router.use("/", pages);
router.use("/", auth);
router.use("/", medications);

module.exports = router;