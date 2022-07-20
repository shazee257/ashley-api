const router = require('express').Router();
const { imageUpload } = require('../utils/utils');
// const { isAuth } = require('../middlewares/auth');
// const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const {
    createProduct,
    addVariant,

    uploadImages,
    getProducts,
    addFeature
} = require('../controllers/product');

router.post('/', createProduct);
router.get('/', getProducts);
router.post('/:productId', addVariant); //add new variant to product

router.post('/:productId/:variantId',
    imageUpload.array('images', 10), addFeature); //add new feature to variant product

// Max limit of images 10 with single color
router.put('/images/:productId/:featureId',
    // imageUpload.array('images', 10), 
    uploadImages);

module.exports = router;