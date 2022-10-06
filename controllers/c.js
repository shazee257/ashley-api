const { saveC, fetchAllC } = require('../models/c');

// create a new C
exports.createC = async (req, res, next) => {
    try {
        const c = await saveC(req.body);
        res.status(201).json(c);
    } catch (err) {
        next(err);
    }
}

// get all C
exports.getAllC = async (req, res, next) => {
    try {
        const c = await fetchAllC(req.query);
        res.status(200).json(c);
    } catch (err) {
        next(err);
    }
}
