const router = require("express").Router();
const { userLogin, userLogout } = require("../controllers/auth");

router.post("/login", userLogin);
router.get("/logout", userLogout);

module.exports = router;