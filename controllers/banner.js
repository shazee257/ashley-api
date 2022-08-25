const BannerModel = require('../models/banner');
const { thumbnail } = require('../utils/utils');

// create a new banner
exports.createBanner = async (req, res, next) => {
    let bannerData = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        is_active: req.body.is_active,
    };

    if (req.file) {
        bannerData.image = req.file.filename
        thumbnail(req, "banners");
    };



    try {
        const banner = await BannerModel.create(bannerData);
        res.status(200).json({
            success: true,
            banner,
            message: 'Banner added successfully',
        });
    } catch (error) {
        next(error);
    }
};

// get all banners
exports.getAllBanners = async (req, res, next) => {
    try {
        const banners = await BannerModel.find({ 'is_deleted': false, 'is_active': true });
        res.status(200).json({
            success: true,
            banners,
            message: 'Banners fetched successfully',
        });
    } catch (error) {
        next(error);
    }
}

// get banner
exports.getBanner = async (req, res, next) => {
    try {
        const banner = await BannerModel.findOne({ '_id': req.params.id, 'is_deleted': false, 'is_active': true });
        res.status(200).json({
            success: true,
            banner,
            message: 'Banner fetched successfully',
        });
    } catch (error) {
        next(error);
    }
}

// update banner
exports.updateBanner = async (req, res, next) => {
    let bannerData = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        is_active: req.body.is_active,
    };

    try {
        const banner = await BannerModel.findByIdAndUpdate(req.params.id, bannerData, { new: true });
        res.status(200).json({
            success: true,
            banner,
            message: 'Banner updated successfully',
        });
    } catch (error) {
        next(error);
    }
}

// upload banner image
exports.uploadBannerImage = async (req, res, next) => {
    if (req.file) {
        // bannerData.image = req.file.filename
        thumbnail(req, "banners");
        try {
            const banner = await BannerModel.findByIdAndUpdate(req.params.id, req.file.filename, { new: true });
            res.status(200).json({
                success: true,
                banner,
                message: 'Banner image uploaded successfully',
            });
        } catch (error) {
            next(error);
        }
    } else {
        res.status(200).json({
            success: false,
            message: 'No image uploaded',
        });
    }
}

// delete banner
exports.deleteBanner = async (req, res, next) => {
    try {
        const banner = await BannerModel.findByIdAndUpdate(req.params.id, { 'is_deleted': true }, { new: true });
        res.status(200).json({
            success: true,
            banner,
            message: 'Banner deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}