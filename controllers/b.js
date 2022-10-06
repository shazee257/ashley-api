const BModel = require('../models/b');

// create a new B
exports.createB = async (req, res, next) => {
    try {
        const b = await BModel.create(req.body);
        res.status(200).json(b);
    } catch (err) {
        next(err);
    }
}

// get all B
exports.getAllB = async (req, res, next) => {
    try {
        const b = await BModel.find().populate("cId");
        res.status(200).json(b);
    } catch (err) {
        next(err);
    }
}
