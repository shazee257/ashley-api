const router = require('express').Router();

const brandsApi = require('./brand');
const categoriesApi = require('./category');
const storesApi = require('./store');
const usersApi = require('./user');
const productsApi = require('./product');
const colorsApi = require('./color');
const cartApi = require('./cart');
const wishlistApi = require('./wishlist');
const bannersApi = require('./banner');
const reviewsApi = require('./reviews');
const ordersApi = require('./order');
const couponsApi = require('./coupons');

router.use('/brands', brandsApi);
router.use('/categories', categoriesApi);
router.use('/stores', storesApi);
router.use('/users', usersApi);
router.use('/products', productsApi);
router.use('/colors', colorsApi);
router.use('/cart', cartApi);
router.use('/wishlist', wishlistApi);
router.use('/banners', bannersApi);
router.use('/reviews', reviewsApi);
router.use('/orders', ordersApi);
router.use('/coupons', couponsApi);

// router.use('/c', require('./c'));
// router.use('/b', require('./b'));
// router.use('/a', require('./a'));
// router.use('/d', require('./d'));

module.exports = router;