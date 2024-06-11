const router = require("express").Router();
const { registerUser, userLogin, userLogout, logOutFromOthers, logOutFromAll, getUser } = require("../controllers/auth");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/register", registerUser);
router.post("/login", userLogin);
router.post("/logout", authenticateToken, userLogout);
router.post("/logout-others", authenticateToken, logOutFromOthers);
router.post("/logout-all", authenticateToken, logOutFromAll);
router.get("/getUser", authenticateToken, getUser);

module.exports = router;