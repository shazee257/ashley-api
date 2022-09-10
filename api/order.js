const router = require('express').Router();

const {
    createOrder,
    getOrdersByUser,
    getAllOrders,
    orderTracking,
} = require('../controllers/order');

router.post('/', createOrder);
router.post('/tracking', orderTracking);

router.get('/:userId', getOrdersByUser);
router.get('/', getAllOrders);


module.exports = router;