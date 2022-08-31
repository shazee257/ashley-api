const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    addReviews,
    getReviews,
} = require('../controllers/reviews');

router.post('/:productId', upload('reviews').array('images', 10), addReviews);

router.get('/:productId', getReviews);
// router.get('/:id', getBanner);
// router.put('/:id', updateBanner);
// router.post('/:id/image', upload('banners').single('image'), uploadBannerImage);
// router.delete('/:id', deleteBanner);

module.exports = router;