const sessionChecker = require("../middlewares/validateUser");
const { getReports } = require("../controllers/reports");

const router = require("express").Router();

router.get("/myReports", sessionChecker, getReports);

module.exports = router;