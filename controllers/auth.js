const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { addToBlacklist, tokenBlacklist } = require("../tokens/tokens");

module.exports = {
    registerUser: async (req, res) => {
        try {
            const {
                first_name,
                last_name,
                email,
                password
            } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const new_user = await db.users.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashedPassword
            });
            await new_user.save();
            return res.status(200).json({ success: true, messsage: "Registered!!" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await db.users.findOne({
                where: {
                    email: email
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                },
                raw: true
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
            return res.status(200).json({ success: true, message: "Logged in!" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    userLogout: async (req, res) => {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            addToBlacklist(token);
            res.clearCookie("token");
            return res.redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    logOutFromOthers: async (req, res) => {
        try {
            const user = await db.users.findOne({
                where: {
                    id: req.user.id
                }
            });
            const currentToken = req.cookies.token;
            user.tokenVersion += 1;
            await user.save();
            addToBlacklist(currentToken);
            const newToken = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            res.cookie('token', newToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            });
            tokenBlacklist.delete(currentToken);
            return res.status(200).redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    logOutFromAll: async (req, res) => {
        try {
            const user = await db.users.findOne({
                where: {
                    id: req.user.id
                }
            });
            user.tokenVersion += 1;
            await user.save();
            res.clearCookie("token");
            return res.status(204).redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}