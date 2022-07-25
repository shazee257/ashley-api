const router = require('express').Router();
// const { isAuth } = require('../middlewares/auth');
const { imageUpload } = require('../utils/utils');

const {
    createSlider,
    getAllSliders,
    getSliderById,
    updateSliderById,
    deleteSliderById,
    uploadSliderImage,
    sliderEnableDisableById
} = require('../controllers/slider');

router.post('/', imageUpload.single('image'), createSlider);
router.post('/:id/upload', imageUpload.single('image'), uploadSliderImage);

router.get('/', getAllSliders);
router.get('/:id', getSliderById);
router.put('/:id', updateSliderById);
router.put('/:id/status', sliderEnableDisableById);

router.delete('/:id', deleteSliderById);


module.exports = router;