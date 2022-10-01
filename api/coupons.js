const router = require('express').Router();

const {
    getAllCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/coupons');

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/:id', getCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);


module.exports = router;