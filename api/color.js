const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createColor,
} = require('../controllers/color');

router.post('/', upload("colors").single('image'), createColor);

// router.get('/', getAllSliders);
// router.get('/:id', getSliderById);
// router.put('/:id', updateSliderById);
// router.delete('/:id', deleteSliderById);


module.exports = router;