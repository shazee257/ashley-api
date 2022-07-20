const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { imageUpload } = require('../utils/utils');

const {
    registerUser, loginUser, forgotPassword, resetPassword, newPassword,
    changePassword, getUser, getUsers, getAdminUsers,
    deleteUser, deleteUsers, updateUser,
    createAddress, updateAddress, getAddresses, deleteAddress,
    uploadUserImage,
    verifyAccessToken

} = require('../controllers/user');

// const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', imageUpload.single('image'), registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:resetToken', resetPassword);
router.post('/new-password/:userId', newPassword);

router.get('/verify-token', verifyAccessToken);

router.get('/:userId', getUser);

router.get('/', getUsers);

router.get('/admin/users', getAdminUsers);

router.delete('/:userId', deleteUser);

router.delete('/', deleteUsers);

router.post('/change-password/:userId', changePassword);

router.put('/:userId', updateUser);

router.post('/address/:userId', createAddress);
router.put('/address/:addressId', updateAddress);
router.get('/address/:userId', getAddresses);
router.delete('/address/:addressId', deleteAddress);
router.post('/:userId/upload-image', imageUpload.single('image'), uploadUserImage);


module.exports = router;