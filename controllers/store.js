const StoreModel = require('../models/store');
const { thumbnail } = require('../utils/utils');

// create a new store
exports.createStore = async (req, res, next) => {
    if (req.file) {
        req.body.banner = req.file.filename
        thumbnail(req);
    }

    try {
        const store = await StoreModel.create(req.body);
        res.status(200).json({
            success: true,
            store,
            message: 'New Store / Franchise added successfully',
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
            const store = await StoreModel.findOneAndUpdate(
                { slug: req.params.slug, is_deleted: false },
                { banner: req.file.filename },
                { new: true }
            );
            thumbnail(req);

            res.status(200).json({
                success: true,
                store,
                message: 'Image uploaded successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    return res.status(400).json({
        status: 400,
        message: "Please upload file.",
    });
}

// get a store
exports.getStore = async (req, res, next) => {
    try {
        const store = await StoreModel.findOne({ slug: req.params.slug, is_deleted: false });
        res.status(200).json({
            success: true,
            store
        });
    } catch (error) {
        next(error);
    }
}

// get all stores
exports.getAllStores = async (req, res, next) => {
    try {
        const stores = await StoreModel.find({ is_deleted: false })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            stores
        });
    } catch (error) {
        next(error);
    }
}

// update a store
exports.updateStore = async (req, res, next) => {
    try {
        const store = await StoreModel.
            findOneAndUpdate({ slug: req.params.slug, is_deleted: false },
                req.body, { new: true }
            );

        res.status(200).json({
            success: true,
            message: 'Store updated successfully',
            store
        });
    } catch (error) {
        next(error);
    }
}

// delete a store (soft delete)
exports.deleteStore = async (req, res, next) => {
    try {
        const store = await StoreModel.
            findOneAndUpdate({ slug: req.params.slug, is_deleted: false },
                { is_deleted: true },
                { new: true }
            );
        console.log(store);
        res.status(200).json({
            success: true,
            store,
            message: 'Store deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

