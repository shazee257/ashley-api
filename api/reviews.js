const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    addReviews,
    getReviews,
} = require('../controllers/reviews');

router.post('/:productId', upload('reviews').array('images', 10), addReviews);
router.get('/:productId', getReviews);

module.exports = router;