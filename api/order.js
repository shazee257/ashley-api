const router = require('express').Router();

const { addToCart } = require('../controllers/order');

router.post('/:userId', addToCart);




module.exports = router;