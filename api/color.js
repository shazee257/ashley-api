const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createColor, getAllColors, getColor, updateColor, deleteColor,
} = require('../controllers/color');

router.post('/', upload("colors").single('image'), createColor);
router.get('/', getAllColors);
router.get('/:id', getColor);
router.put('/:id', upload("colors").single('image'), updateColor);
router.delete('/:id', deleteColor);


module.exports = router;