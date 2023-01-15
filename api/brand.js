const router = require('express').Router();
const { upload, uploadS3 } = require('../utils/utils');

const {
    createBrand, uploadImage,
    getBrand,
    getAllBrands,
    updateBrand, deleteBrand,
} = require('../controllers/brand');

// router.post('/', uploadS3.single('image'), createBrand);
router.post('/', upload('brands').single('image'), createBrand);
router.post('/upload-image/:id', upload("brands").single('image'), uploadImage);
router.get('/', getAllBrands);
router.get('/:id', getBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;