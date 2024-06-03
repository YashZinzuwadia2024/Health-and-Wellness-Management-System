const router = require("express").Router();
const { getCountOfMeds, getCountOfReports, getMedications } = require("../controllers/medications");

router.get("/getCountOfMed", getCountOfMeds);
router.get("/getCountOfReports", getCountOfReports);
router.get("/getMedications", getMedications);

module.exports = router;