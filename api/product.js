const router = require('express').Router();
const { upload } = require('../utils/utils');
// const { isAuth } = require('../middlewares/auth');

const {
    createProduct, addVariant, addFeature,
    // getProductVariants,

    deleteProduct, deleteVariant, deleteFeature,
    getProductBySlug, getProduct, getProducts,
    updateProduct, updateVariant, updateFeature,
    uploadImages,

} = require('../controllers/product');

router.post('/', createProduct);
router.post('/:productId', addVariant); //add new variant to product
router.post('/:productId/:variantId', upload("products").array('files', 10), addFeature); //add new feature to variant product

router.get('/', getProducts);
router.get('/p/:id', getProduct);
router.get('/:slug', getProductBySlug);


router.put('/:productId', updateProduct);
router.put('/:productId/:variantId', updateVariant);
router.put('/:productId/:variantId/:featureId', updateFeature);

router.delete('/:productId', deleteProduct);
router.delete('/:productId/:variantId', deleteVariant);
router.delete('/:productId/:variantId/:featureId', deleteFeature);



// router.get('/v/:productId', getProductVariants);

router.put('/upload/:productId/:variantId/:featureId', upload("products").array('files', 10), uploadImages);

module.exports = router;