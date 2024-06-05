const users = require("../models/index").users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await users.findOne({
                where: {
                    email: email
                }
            });
            if (!user) return res.status(400).json({ message: "Bad Request!" });
            const passCheck = await bcrypt.compare(password, user.password);
            if (!passCheck) return res.status(400).json({ message: "Invalid Email Or Password!" });
            const token = jwt.sign(user, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            });
            return res.redirect("/home");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    userLogout: (req, res) => {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            addToBlacklist(token);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}