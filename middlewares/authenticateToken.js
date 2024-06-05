const jwt = require('jsonwebtoken');
const { isBlacklisted } = require("../tokens/tokens");
const db = require("../models/index");

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    if (isBlacklisted(token)) return res.sendStatus(403);
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);
        const dbUser = await db.users.findById(user.id);
        if (user.tokenVersion !== dbUser.tokenVersion) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


module.exports = authenticateToken;
