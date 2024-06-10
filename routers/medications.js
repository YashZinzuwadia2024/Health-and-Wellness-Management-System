const router = require("express").Router();
const { getCountOfMeds,
    getCountOfReports,
    getMedications,
    getMedication,
    addMedication,
    updateMedication,
    deleteMedication,
    markAsDone
} = require("../controllers/medications");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/getCountOfMed", authenticateToken, getCountOfMeds);
router.get("/getCountOfReports", authenticateToken, getCountOfReports);
router.get("/getMedications", authenticateToken, getMedications);
router.get("/getMedication/:id", authenticateToken, getMedication);
router.post("/medications/updateMedication/:id", authenticateToken, updateMedication);
router.post("/medications/deleteMedication",authenticateToken, deleteMedication);
router.post("/medications/addMedication", authenticateToken, addMedication);
router.post("/markAsDone", markAsDone);

module.exports = router;