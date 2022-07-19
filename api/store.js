const router = require('express').Router();
const { imageUpload } = require('../utils/utils');

const {
    createStore,
    uploadImage,
    getStore,
    getAllStores,
    updateStore,
    deleteStore
} = require('../controllers/store');

router.post('/', imageUpload.single('banner'), createStore);
router.post('/upload-image/:slug', imageUpload.single('banner'), uploadImage);

router.get('/', getAllStores);
router.get('/:slug', getStore);

router.put('/:slug', updateStore);
router.delete('/:slug', deleteStore);


module.exports = router;