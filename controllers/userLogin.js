const users = require("../models/index").users;
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({
            email: email
        });
        if (!user) return res.status(400).json({ message: "Bad Request!" });
        const passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) return res.status(400).json({ message: "Invalid Email Or Password!" });
        return res.redirect("/home");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}