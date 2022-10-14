const SessionModel = require("../models/session");

exports.loggedIn = async (req, res, next) => {
    let { token } = req.headers;
    if (!token) {
        return res.status(403).json({
            success: false,
            message: "Access denied."
        });
    }

    const session = await SessionModel.findOne({
        token: token,
        expiry_date: { $gte: new Date() },
    }).populate("user_id");

    if (!session) {
        return res.status(403).json({
            success: false,
            error: "You're not authorized!"
        });
    }

    req.user = session.user_id;
    req.session = session;
    next();
};

