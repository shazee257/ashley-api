const router = require('express').Router();
const { upload } = require('../utils/utils');
const { chargeCreditCard } = require('../middlewares/authorizenet');

const {
    createBrand, uploadImage,
    getBrandBySlug,
    getAllBrands,
    updateBrand, deleteBrand,
    test
} = require('../controllers/brand');

router.post('/', upload("brands").single('image'), createBrand);
router.post('/upload-image/:slug', upload("brands").single('image'), uploadImage);

router.get('/', getAllBrands);
router.get('/:slug', getBrandBySlug);

router.put('/:slug', updateBrand);
router.delete('/:slug', deleteBrand);

// testing payment API

// router.post("/test/payment", chargeCreditCard, (req, res) => {
//     res.status(200).json({
//         message: "Payment Successful"
//     });
// });


module.exports = router;