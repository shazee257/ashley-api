const router = require('express').Router();
const { upload } = require('../utils/utils');
// const { isAuth } = require('../middlewares/auth');

const {
    createProduct,
    // getProductVariants,
    addVariant,
    deleteVariant,

    addFeature,

    getProductBySlug,
    deleteProduct,

    updateProduct,


    uploadImages,
    getProducts,
} = require('../controllers/product');

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);
router.delete('/:productId/:variantId', deleteVariant);

// router.get('/v/:productId', getProductVariants);
router.post('/:productId', addVariant); //add new variant to product

router.post('/:productId/:variantId',
    upload("products").array('images', 10), addFeature); //add new feature to variant product

// Max limit of images 10 with single color
router.put('/images/:productId/:featureId',
    // imageUpload.array('images', 10), 
    uploadImages);

module.exports = router;