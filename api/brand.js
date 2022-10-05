const { authorizeCreditCard } = require('../utils/authorizeCreditCard');
// const { chargeCreditCard } = require('../utils/chargeCreditCard');

const router = require('express').Router();
const { upload } = require('../utils/utils');

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

// // testing payment API
// router.post("/test/pay/auth", (req, res) => {
//     authorizeCreditCard((response) => {
//         res.status(200).json({
//             success: true,
//             response,
//             message: 'Payment done successfully',
//         });
//     });
// });

// router.post("/test/pay/charge", (req, res) => {
//     chargeCreditCard((response) => {
//         res.status(200).json({
//             success: true,
//             response,
//             message: 'Payment done successfully',
//         });
//     });
// });


module.exports = router;