const authenticateToken = require("../middlewares/authenticateToken");
const { getReports } = require("../controllers/reports");

const router = require("express").Router();

router.get("/myReports", authenticateToken, getReports);

module.exports = router;