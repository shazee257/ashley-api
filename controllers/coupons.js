const CouponsModel = require('../models/coupons');

// get all coupons
exports.getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await CouponsModel.find({ isActive: true })
            .sort({ createdAt: -1 }).lean();
        res.status(200).json(coupons);
    } catch (error) {
        next(error);
    }
};

// create coupon
exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await CouponsModel.create(req.body);
        res.status(200).json({
            coupon,
            message: 'Coupon created successfully'
        });
    } catch (error) {
        next(error);
    }
};

// get coupon by code
exports.getCoupon = async (req, res, next) => {
    try {
        const { code } = req.params;
        const coupon = await CouponsModel.findOne({ code, isActive: true }).lean();
        res.status(200).json(coupon);
    } catch (error) {
        next(error);
    }
};

// update coupon
exports.updateCoupon = async (req, res, next) => {
    try {
        const coupon = await CouponsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        res.status(200).json({
            coupon,
            message: 'Coupon updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// soft delete coupon
exports.deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await CouponsModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).lean();
        res.status(200).json({
            coupon,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};