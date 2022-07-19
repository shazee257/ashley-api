const router = require('express').Router();
// const { isAuth } = require('../middlewares/auth');
const { imageUpload } = require('../utils/utils');

const {
    createBrand, uploadImage,
    getBrandBySlug,
    // getBrandById,
    getAllBrands,
    updateBrand, deleteBrand
} = require('../controllers/brand');

router.post('/', imageUpload.single('image'), createBrand);
router.post('/upload-image/:slug', imageUpload.single('image'), uploadImage);

router.get('/', getAllBrands);
router.get('/:slug', getBrandBySlug);

router.put('/:slug', updateBrand);
router.delete('/:slug', deleteBrand);


module.exports = router;