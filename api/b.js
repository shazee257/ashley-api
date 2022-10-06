const router = require('express').Router();

const {
    createB,
    getAllB,
} = require('../controllers/b');

router.post('/', createB);
router.get('/', getAllB);



module.exports = router;