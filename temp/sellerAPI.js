const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');
const { imageUpload } = require('../utils/utils');


const {
    getSeller, getSellers,
    getSellersApproved, getSellersPending,
    updateSeller, deleteSeller,
    makeSellerApproved, makeSellerPending,
    uploadBanner

} = require('../controllers/seller');


router.get('/', getSellers);
router.get('/approved', isAuth, getSellersApproved);
router.get('/pending', isAuth, getSellersPending);
router.get('/:sellerId', isAuth, getSeller);
router.put('/:sellerId', isAuth, updateSeller);
router.delete('/:sellerId', isAuth, deleteSeller);
// router.put('/:sellerId/approve', isAuth, makeSellerApproved);
// router.put('/:sellerId/pending', isAuth, makeSellerPending);
router.post('/upload-banner', isAuth, imageUpload.single('shop_banner'), uploadBanner);




module.exports = router;