const CouponsModel = require('../models/coupons');

// get all coupons
exports.getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await CouponsModel.find().sort({ createdAt: -1 }).lean();
        res.status(200).json(coupons);
    } catch (error) {
        next(error);
    }
};

// create coupon
exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await CouponsModel.create(req.body);
        res.status(200).json(coupon);
    } catch (error) {
        next(error);
    }
}