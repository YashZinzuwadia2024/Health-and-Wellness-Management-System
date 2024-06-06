const jwt = require('jsonwebtoken');
const { isBlacklisted } = require("../tokens/tokens");
const db = require("../models/index");

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(403).redirect("/");
        if (isBlacklisted(token)) return res.status(403).redirect("/");

        jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                console.log(err);
                return res.status(200).redirect("/");
            }
            const dbUser = await db.users.findOne({
                where: {
                    id: user.id
                }
            });
            if (user.tokenVersion !== dbUser.tokenVersion) return res.status(400).redirect("/");
            req.user = user;
            return next();
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = authenticateToken;
