const router = require('express').Router();

router.use('/brands', require('./brand'));
router.use('/categories', require('./category'));
router.use('/stores', require('./store'));
router.use('/users', require('./user'));
router.use('/products', require('./product'));
router.use('/colors', require('./color'));
router.use('/cart', require('./cart'));
router.use('/wishlist', require('./wishlist'));
router.use('/banners', require('./banner'));
router.use('/reviews', require('./reviews'));
router.use('/orders', require('./order'));
router.use('/coupons', require('./coupons'));


module.exports = router;