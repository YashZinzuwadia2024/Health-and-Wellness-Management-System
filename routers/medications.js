const router = require("express").Router();
const { getCountOfMeds, getCountOfReports, getMedications, addMedication } = require("../controllers/medications");
const sessionChecker = require("../middlewares/validateUser");

router.get("/getCountOfMed", sessionChecker, getCountOfMeds);
router.get("/getCountOfReports", sessionChecker, getCountOfReports);
router.get("/getMedications", sessionChecker, getMedications);
router.post("/medications/addMedication", sessionChecker, addMedication);

module.exports = router;