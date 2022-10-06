const router = require('express').Router();
const DModel = require('../models/d');

router.post('/', async (req, res, next) => {
    try {
        const d = await DModel.create(req.body);
        res.status(200).json(d);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const d = await DModel.find();
        res.status(200).json(d);
    } catch (err) {
        next(err);
    }
});

module.exports = router;