const BrandModel = require('../models/brand');
const { thumbnail } = require('../utils/utils');

// create a new brand
exports.createBrand = async (req, res, next) => {
    let brandData = {
        title: req.body.title,
        description: req.body.description
    };

    if (req.file) {
        brandData.image = req.file.filename
        thumbnail(req, "brands");
    };

    try {
        const brand = await BrandModel.create(brandData);
        res.status(200).json({
            success: true,
            brand,
            message: 'Brand added successfully',
        });
    } catch (error) {
        next(error);
    }
};

// upload image and update (delete image file if exists)
exports.uploadImage = async (req, res, next) => {
    if (req.file) {
        if (req.fileValidationError) {
            return res.status(400).json({
                status: 400, message: req.fileValidationError,
            });
        }

        try {
            await BrandModel.findOneAndUpdate(
                { _id: req.params.id, is_deleted: false },
                { image: req.file.filename }
            );
            thumbnail(req, "brands");

        } catch (error) {
            next(error);
        }

        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
        });
    }

    return res.status(400).json({
        status: 400,
        message: "Please upload file.",
    });
}

// get a brand
exports.getBrand = async (req, res, next) => {
    try {
        const brand = await BrandModel.findById(req.params.id);
        res.status(200).json({
            success: true,
            brand
        });
    } catch (error) {
        next(error);
    }
}

// get all brands
exports.getAllBrands = async (req, res, next) => {
    try {
        const brands = await BrandModel.find({ is_deleted: false })
            .sort({ title: 1 });
        res.status(200).json({
            success: true,
            brands
        });
    } catch (error) {
        next(error);
    }
}

// update a brand
exports.updateBrand = async (req, res, next) => {
    const { title, description } = req.body;
    try {
        const brand = await BrandModel.findOneAndUpdate(
            { _id: req.params.id },
            { title, description }, { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Brand updated successfully',
            brand
        });
    } catch (error) {
        next(error);
    }
}

// delete a brand (soft delete)
exports.deleteBrand = async (req, res, next) => {
    try {
        await BrandModel.findByIdAndUpdate(req.params.id, { is_deleted: true });
        res.status(200).json({
            success: true,
            message: 'Brand deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

