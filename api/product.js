const router = require('express').Router();
const { imageUpload } = require('../utils/utils');
// const { isAuth } = require('../middlewares/auth');

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const {
    createProduct, uploadImages,
    getProducts
} = require('../controllers/product');

router.post('/', use(createProduct));

router.get('/', use(getProducts));

// Max limit of images 10 with single color
router.put('/images/:productId/:featureId',
    // imageUpload.array('images', 10), 
    use(uploadImages));

module.exports = router;