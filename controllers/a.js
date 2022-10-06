const AModel = require('../models/a');

// create a new A
exports.createA = async (req, res, next) => {
    try {
        const a = await AModel.create(req.body);
        res.status(200).json(a);
    } catch (err) {
        next(err);
    }
}

// get all A
exports.getAllA = async (req, res, next) => {
    try {
        const a = await AModel.find({})
            .select('-__v -_id')
            .populate({
                path: 'bId',
                select: '-__v -_id',
                populate: {
                    path: 'cId',
                    select: '-__v -_id',
                    populate: {
                        path: 'dId',
                        select: '-__v -_id',
                    }
                }
            });
        res.status(200).json(a);
    } catch (err) {
        next(err);
    }
}
