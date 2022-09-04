const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createStore,
    uploadImage,
    getStore,
    getAllStores,
    updateStore,
    deleteStore
} = require('../controllers/store');

router.post('/', upload("stores").single('banner'), createStore);
router.post('/upload-image/:id', upload("stores").single('banner'), uploadImage);

router.get('/', getAllStores);
router.get('/:id', getStore);

router.put('/:id', updateStore);
router.delete('/:id', deleteStore);


module.exports = router;