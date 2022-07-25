const SliderModel = require('../models/slider');
const { thumbnail } = require('../utils/utils');

// create a new slider
exports.createSlider = async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.filename
        thumbnail(req);

        try {
            const slider = await SliderModel.create(req.body);
            res.status(200).json({
                success: true,
                slider,
                message: 'Slider created successfully',
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

// get all sliders
exports.getAllSliders = async (req, res, next) => {
    try {
        const sliders = await SliderModel.find({ is_deleted: false });
        res.status(200).json({
            success: true,
            sliders,
            message: 'All sliders retrieved successfully',
        });
    } catch (error) {
        next(error);
    }
}

// get slider by id
exports.getSliderById = async (req, res, next) => {
    try {
        const slider = await SliderModel.findOne({ _id: req.params.id, is_deleted: false });
        res.status(200).json({
            success: true,
            slider,
            message: 'Slider retrieved successfully',
        });
    } catch (error) {
        next(error);
    }
}

// update slider by id
exports.updateSliderById = async (req, res, next) => {
    try {
        const slider = await SliderModel.findOneAndUpdate(
            { _id: req.params.id, is_deleted: false }, req.body, { new: true });
        res.status(200).json({
            success: true,
            slider,
            message: 'Slider updated successfully',
        });
    } catch (error) {
        next(error);
    }
}

// delete slider by id
exports.deleteSliderById = async (req, res, next) => {
    try {
        const slider = await SliderModel.findOneAndUpdate(
            { _id: req.params.id, is_deleted: false }, { is_deleted: true }, { new: true });
        res.status(200).json({
            success: true,
            slider,
            message: 'Slider deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

// upload slider image
exports.uploadSliderImage = async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.filename
        thumbnail(req);

        try {
            const slider = await SliderModel.findOneAndUpdate(
                { _id: req.params.id, is_deleted: false },
                { image: req.body.image }, { new: true });
            res.status(200).json({
                success: true,
                slider,
                message: 'Slider image uploaded successfully',
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
}

// make slider active
exports.sliderEnableDisableById = async (req, res, next) => {
    let status = req.body.status;

    return console.log("status", status);
    try {
        const slider = await SliderModel.findOneAndUpdate(
            { _id: req.params.id, is_deleted: false },
            { enabled: status }, { new: true });
        res.status(200).json({
            success: true,
            slider,
            message: 'Slider status is updated!',
        });
    } catch (error) {
        next(error);
    }
}
