const router = require('express').Router();

const {
    getAllCoupons,
    // getCoupon,
    // createCoupon,
    // updateCoupon,
    // deleteCoupon,
} = require('../controllers/coupons');

// router.post('/', createCoupons);
router.get('/', getAllCoupons);


module.exports = router;