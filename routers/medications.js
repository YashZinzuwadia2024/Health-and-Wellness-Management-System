const router = require("express").Router();
const { getCountOfMeds,
    getCountOfReports,
    getMedications,
    addMedication,
    deleteMedication,
    markAsDone
} = require("../controllers/medications");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/getCountOfMed", authenticateToken, getCountOfMeds);
router.get("/getCountOfReports", authenticateToken, getCountOfReports);
router.get("/getMedications", authenticateToken, getMedications);
router.post("/deleteMedication", deleteMedication)
router.post("/medications/addMedication", authenticateToken, addMedication);
router.post("/markAsDone", markAsDone);

module.exports = router;