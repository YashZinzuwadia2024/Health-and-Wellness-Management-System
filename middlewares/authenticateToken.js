const jwt = require('jsonwebtoken');
const db = require("../models/index");

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect("/");
        jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                console.log(err);
                return res.redirect("/");
            }
            const user_activity = await db.user_tokens.findOne({
                where: {
                    user_id: user.id,
                    device_IP: req.socket.remoteAddress
                },
                attributes: ['id', 'token', 'logged_in'],
                order: [['id', 'DESC']],
                raw: true
            });
            if (!user_activity || user_activity.logged_in === 0) {
                res.clearCookie("token");
                return res.redirect("/")
            };
            req.user = user;
            return next();
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = authenticateToken;
