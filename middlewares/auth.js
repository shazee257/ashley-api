const SessionModel = require('../models/session');

exports.isAuth = async (req, res, next) => {
    console.log("Auth middleware");
    let accessToken = req.get("Authorization");
    if (!accessToken) {
        return res.status(403).json({
            success: false,
            message: 'Access denied.'
        });
    }

    try {
        const session = await SessionModel.findOne({
            token: accessToken, expiry_date: { $gte: new Date() }
        }).populate('user_id');

        if (!session) {
            return res.status(401).json({
                success: false, message: 'Unauthorized'
            });
        }

        req.session = session;
        req.user = session.user_id;
        // return console.log(`session.user_id:  ${session.user_id}`);
        next();
    } catch (error) {
        next(error);
    }
}

exports.isSellerAuth = async (req, res, next) => {
    console.log("Seller Auth middleware");
    let accessToken = req.get("Authorization");
    if (!accessToken) {
        return res.status(403).json({
            success: false,
            message: 'Access denied.'
        });
    }

    try {
        const session = await SessionModel.findOne({
            token: accessToken, expiry_date: { $gte: new Date() }
        }).populate('user_id');

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        req.session = session;
        req.user = session.user_id;
        next();
    } catch (error) {
        next(error);
    }
}