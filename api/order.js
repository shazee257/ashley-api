const router = require('express').Router();

const { createOrder } = require('../controllers/order');

router.post('/:userId', createOrder);




module.exports = router;