const router = require('express').Router();
const { upload } = require('../utils/utils');
// const { chargeCreditCard } = require('../middlewares/authorizenet');

const {
    createBrand, uploadImage,
    getBrand,
    getAllBrands,
    updateBrand, deleteBrand,
} = require('../controllers/brand');

router.post('/', upload("brands").single('image'), createBrand);
router.post('/upload-image/:id', upload("brands").single('image'), uploadImage);

router.get('/', getAllBrands);
router.get('/:id', getBrand);

router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

// testing payment API

// router.post("/test/payment", chargeCreditCard, (req, res) => {
//     res.status(200).json({
//         message: "Payment Successful"
//     });
// });


module.exports = router;