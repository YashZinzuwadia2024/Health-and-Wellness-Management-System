const users = require("../models/index").users;
const bcrypt = require("bcrypt");

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
            req.session.profile = user;
            await req.session.save();
            return res.redirect("/home");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    },
    userLogout: (req, res) => {
        try {
            req.session.destroy((error) => {
                if (error) return error;
            });
            res.clearCookie("mySession");
            return res.redirect("/");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}