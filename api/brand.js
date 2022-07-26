const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createBrand, uploadImage,
    getBrandBySlug,
    getAllBrands,
    updateBrand, deleteBrand
} = require('../controllers/brand');

router.post('/', upload("brands").single('image'), createBrand);
router.post('/upload-image/:slug', upload("brands").single('image'), uploadImage);

router.get('/', getAllBrands);
router.get('/:slug', getBrandBySlug);

router.put('/:slug', updateBrand);
router.delete('/:slug', deleteBrand);


module.exports = router;