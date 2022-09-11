const ColorModel = require('../models/color');

// create new color
exports.createColor = async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.filename

        try {
            const color = await ColorModel.create({ title: req.body.title, image: req.body.image });
            res.status(200).json({
                success: true,
                color,
                message: 'Color created successfully',
            });
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: 'Please upload an image' });
    }
};

// get all colors
exports.getAllColors = async (req, res, next) => {
    try {
        const colors = await ColorModel.find({ is_deleted: false })
            .sort({ title: 1 });
        res.status(200).json({
            success: true,
            colors,
            message: 'Colors retrieved successfully',
        });
    } catch (error) {
        next(error);
    }
}

// get color
exports.getColor = async (req, res, next) => {
    try {
        const color = await ColorModel.findOne({ _id: req.params.id, is_deleted: false });
        res.status(200).json({
            success: true,
            color,
            message: 'Color retrieved successfully',
        });
    } catch (error) {
        next(error);
    }
}

// update color
exports.updateColor = async (req, res, next) => {
    try {
        const color = await ColorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            color,
            message: 'Color updated successfully',
        });
    } catch (error) {
        next(error);
    }
}

// delete color
exports.deleteColor = async (req, res, next) => {
    try {
        const color = await ColorModel.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true });
        res.status(200).json({
            success: true,
            color,
            message: 'Color deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

