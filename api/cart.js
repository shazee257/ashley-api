const router = require('express').Router();

const {
    addToCart,
    getCart,
    updateCart,
    removeCartItem,
    deleteCart,
} = require('../controllers/cart');

router.post('/', addToCart);
router.get('/:userId', getCart);
router.put('/:userId', updateCart);
router.put('/:userId/remove-item', removeCartItem);
router.delete('/:userId', deleteCart);

module.exports = router;