const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createBanner,
    getActiveBanners,
    getActiveInactiveBanners,
    getBanner,
    updateBanner,
    uploadBannerImage,
    deleteBanner,
    activateDeactiveBanner,
} = require('../controllers/banner');

router.post('/', upload('banners').single('image'), createBanner);
router.get('/', getActiveBanners);
router.get('/all', getActiveInactiveBanners);
router.get('/:id', getBanner);
router.put('/:id', updateBanner);
router.put('/status/:id', activateDeactiveBanner);

router.post('/:id/image', upload('banners').single('image'), uploadBannerImage);
router.delete('/:id', deleteBanner);

module.exports = router;