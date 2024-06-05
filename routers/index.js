const router = require("express").Router();
const pages = require("./pages");
const auth = require("./auth");
const medications = require("./medications");
const reports = require("./reports");

router.use("/", pages);
router.use("/", auth);
router.use("/", medications);
router.use("/", reports);

module.exports = router;