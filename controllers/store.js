const StoreModel = require('../models/store');
const { thumbnail } = require('../utils/utils');
// const { parse } = require('json2csv');
// const fs = require('fs');
// const path = require('path');

// create a new store
exports.createStore = async (req, res, next) => {
    if (req.file) {
        req.body.banner = req.file.filename
        thumbnail(req, "stores");
    }

    try {
        const store = await StoreModel.create(req.body);
        res.status(200).json({
            success: true,
            store,
            message: 'New Store / Warehouse created successfully',
        });
    } catch (error) {
        next(error);
    }
};

// upload image and update (delete image file if exists)
exports.uploadImage = async (req, res, next) => {
    if (req.file) {
        try {
            const store = await StoreModel.findOneAndUpdate(
                { _id: req.params.id, is_deleted: false },
                { banner: req.file.filename },
                { new: true }
            );
            thumbnail(req, "stores");

            return res.status(200).json({
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
        const store = await StoreModel.findOne({ _id: req.params.id, is_deleted: false });
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
            .sort({ title: 1 });

        // const fields = ['title', 'email', 'banner', 'city', 'phone_no', 'createdAt'];
        // const csv = parse(stores, { fields });

        // const path = 'src/assets/';
        // fs.mkdirSync(path, { recursive: true });
        // fs.writeFileSync(path + 'stores.csv', csv);

        // // delete file after 20 seconds
        // setTimeout(() => {
        //     fs.unlinkSync(path + 'stores.csv');
        // }, 20000);

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
        const store = await StoreModel.findOneAndUpdate({ _id: req.params.id, is_deleted: false },
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
        const store = await StoreModel.findOneAndUpdate(
            { _id: req.params.id, is_deleted: false },
            { is_deleted: true }, { new: true }
        );
        res.status(200).json({
            success: true,
            store,
            message: 'Store deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

