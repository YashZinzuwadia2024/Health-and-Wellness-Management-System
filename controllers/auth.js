const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { Op } = require("sequelize");

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
            if (!passCheck) return res.status(400).json({ success: false, message: "Invalid Email Or Password!" });
            delete user.password;
            const token = jwt.sign(user, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            const new_login = await db.user_tokens.create({
                user_id: user.id,
                device_IP: req.socket.remoteAddress,
                token: token
            });
            await new_login.save();
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
            const { user } = req;
            await db.user_tokens.update({ logged_in: 0 }, {
                where: {
                    user_id: user.id,
                    device_IP: req.socket.remoteAddress,
                    token: req.cookies.token
                },
                attributes: ['id', 'token', 'logged_in'],
                order: [['id', 'DESC']]
            });
            // res.clearCookie("token");
            return res.redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    logOutFromOthers: async (req, res) => {
        try {
            const { user } = req;
            await db.user_tokens.update({ logged_in: 0 }, {
                where: {
                    user_id: user.id,
                    device_IP: {
                        [Op.ne]: req.socket.remoteAddress
                    }
                },
                attributes: ['id', 'token', 'logged_in'],
                order: [['id', 'DESC']]
            });
            return res.status(200).redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    logOutFromAll: async (req, res) => {
        try {
            const { user } = req;
            await db.user_tokens.update({ logged_in: 0 }, {
                where: {
                    user_id: user.id
                },
                attributes: ['id', 'token', 'logged_in'],
                order: [['id', 'DESC']]
            });
            return res.status(204).redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await db.users.findOne({
                where: {
                    id: req.user.id
                },
                attributes: ['first_name', 'last_name', 'email'],
                raw: true
            });
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}