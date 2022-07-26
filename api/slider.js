const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createSlider,
    getAllSliders,
    getSliderById,
    updateSliderById,
    deleteSliderById,
    uploadSliderImage,
} = require('../controllers/slider');

router.post('/', upload("slider").single('image'), createSlider);
router.post('/:id/upload', upload("slider").single('image'), uploadSliderImage);

router.get('/', getAllSliders);
router.get('/:id', getSliderById);
router.put('/:id', updateSliderById);
router.delete('/:id', deleteSliderById);


module.exports = router;