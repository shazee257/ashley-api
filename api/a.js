const router = require('express').Router();

const {
    createA,
    getAllA,
} = require('../controllers/a');

router.post('/', createA);
router.get('/', getAllA);



module.exports = router;