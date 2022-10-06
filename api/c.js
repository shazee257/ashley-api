const router = require('express').Router();

const {
    createC,
    getAllC,
} = require('../controllers/c');

router.post('/', createC);
router.get('/', getAllC);



module.exports = router;