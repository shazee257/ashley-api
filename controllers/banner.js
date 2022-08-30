const BannerModel = require('../models/banner');
const { thumbnail } = require('../utils/utils');

// create a new banner
exports.createBanner = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image'
        });
    }

    thumbnail(req, "banners");

    let bannerObj = {
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
        url: req.body.url,
        type: req.body.type,
        category_id: req.body.type === 'category' ? req.body.category_id : null,
    }

    try {
        const banner = await BannerModel.create(bannerObj);
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
        const banners = await BannerModel.find({ 'is_deleted': false, 'is_active': true })
            .populate('category_id');
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
        const banner = await BannerModel.findOne({ '_id': req.params.id, 'is_deleted': false });
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
    let bannerObj = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        type: req.body.type,
        category_id: req.body.type === 'category' ? req.body.category_id : null,
    }

    try {
        const banner = await BannerModel.findByIdAndUpdate(req.params.id, bannerObj, { new: true });
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
        thumbnail(req, "banners");
        try {
            const banner = await BannerModel.findByIdAndUpdate(req.params.id, { image: req.file.filename }, { new: true });
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