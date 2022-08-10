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
        next({
            status: 400,
            message: 'Please upload an image',
        });
    }
};

