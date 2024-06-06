const router = require("express").Router();
const { userLogin, userLogout, logOutFromOthers, logOutFromAll } = require("../controllers/auth");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/login", userLogin);
router.post("/logout", authenticateToken, userLogout);
router.post("/logout-others", authenticateToken, logOutFromOthers);
router.post("/logout-all", authenticateToken, logOutFromAll);

module.exports = router;