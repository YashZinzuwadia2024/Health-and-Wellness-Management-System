const notifier = require('node-notifier')

const sessionChecker = async (req, res, next) => {
    if (req.session.profile) return next();
    notifier.notify({
        title: "Session",
        message: "Session Timed Out..Login Again!!"
    });
    return res.redirect("/");
}

module.exports = sessionChecker;