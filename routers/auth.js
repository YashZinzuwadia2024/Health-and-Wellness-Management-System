const router = require("express").Router();
const { userLogin, userLogout } = require("../controllers/auth");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/login", userLogin);
router.get("/logout", authenticateToken, userLogout);

module.exports = router;