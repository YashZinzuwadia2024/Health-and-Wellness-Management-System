const jwt = require('jsonwebtoken');
const { isBlacklisted } = require("../tokens/tokens");
const db = require("../models/index");

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect("/");
        if (isBlacklisted(token)) return res.redirect("/");

        jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                console.log(err);
                return res.redirect("/");
            }
            const dbUser = await db.users.findOne({
                where: {
                    id: user.id
                }
            });
            if (user.tokenVersion !== dbUser.tokenVersion) return res.redirect("/");
            req.user = user;
            return next();
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = authenticateToken;
