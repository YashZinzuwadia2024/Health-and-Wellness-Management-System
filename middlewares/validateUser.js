const notifier = require('node-notifier')

const sessionChecker = async (req, res, next) => {
    if (req.session.profile) {
        console.log(`Found User : ${req.session.profile.email.split('@')[0]}`)
        return next();
    }
    else {
        notifier.notify({
            title: "Session",
            message: "Session Timed Out..Login Again!!"
        });
        return res.redirect('/login');
    }
}

module.exports = sessionChecker;