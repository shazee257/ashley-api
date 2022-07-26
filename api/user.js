const router = require('express').Router();
// const auth = require('../middlewares/authMiddleware');
const { upload } = require('../utils/utils');

const {
    registerUser, loginUser, forgotPassword, resetPassword, newPassword,
    changePassword, getUser, getUsers,
    deleteUser, deleteUsers, updateUser,
    createAddress, updateAddress, getAddresses, deleteAddress,
    uploadUserImage,
    verifyAccessToken,

    createThumbnail

} = require('../controllers/user');

// const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', upload("users").single('image'), registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:resetToken', resetPassword);
router.post('/new-password/:userId', newPassword);

router.get('/verify-token', verifyAccessToken);

router.get('/:userId', getUser);

router.get('/', getUsers);

router.delete('/:userId', deleteUser);

router.delete('/', deleteUsers);

router.post('/change-password/:userId', changePassword);

router.put('/:userId', updateUser);

router.post('/address/:userId', createAddress);
router.put('/address/:addressId', updateAddress);
router.get('/address/:userId', getAddresses);
router.delete('/address/:addressId', deleteAddress);
router.post('/:userId/upload-image', upload("users").single('image'), uploadUserImage);



router.post('/image/create-thumbnail', upload("users").single('image'), createThumbnail);


module.exports = router;