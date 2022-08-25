const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createBanner,
    getAllBanners,
    getBanner,
    updateBanner,
    uploadBannerImage,
    deleteBanner
} = require('../controllers/banner');

router.post('/', upload('banners').single('image'), createBanner);
router.get('/', getAllBanners);
router.get('/:id', getBanner);
router.put('/:id', updateBanner);
router.post('/:id/image', upload('banners').single('image'), uploadBannerImage);
router.delete('/:id', deleteBanner);

module.exports = router;