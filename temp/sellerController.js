const UserModel = require('../models/user');
const { verifyIdWithToken } = require("../utils/utils");
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');


// Get user by token
exports.getSeller = async (req, res, next) => {
    try {
        verifyIdWithToken(req.params.sellerId, req.user._id);
        const seller = await UserModel.findOne({
            _id: req.user._id, is_deleted: false
        });
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        res.status(200).json({
            success: true,
            data: seller
        });
    } catch (error) {
        next(error);
    }
};

// Get all Sellers
exports.getSellers = async (req, res, next) => {
    try {
        const sellers = await UserModel.find({ role: "seller", is_deleted: false });
        res.status(200).json({
            success: true,
            data: sellers
        });
    } catch (error) {
        next(error);
    }
};

// Get all Approved Sellers
exports.getSellersApproved = async (req, res, next) => {
    try {
        const sellers = await UserModel.find({
            role: "seller",
            status: "approved",
            is_deleted: false
        });
        res.status(200).json({
            success: true,
            data: sellers
        });
    } catch (error) {
        next(error);
    }
};

// Get all Pending Sellers
exports.getSellersPending = async (req, res, next) => {
    try {
        const sellers = await UserModel.find({
            role: "seller",
            status: "pending",
            is_deleted: false
        });
        res.status(200).json({
            success: true,
            data: sellers
        });
    } catch (error) {
        next(error);
    }
};

// Update Seller
exports.updateSeller = async (req, res, next) => {
    try {
        verifyIdWithToken(req.params.sellerId, req.user._id);
        const seller = await UserModel.findOne({
            _id: req.user._id, is_deleted: false
        });
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        const updatedSeller = await UserModel.findOneAndUpdate({
            _id: req.user._id, is_deleted: false
        }, req.body, { new: true });
        res.status(200).json({
            success: true,
            data: updatedSeller
        });
    } catch (error) {
        next(error);
    }
};

// Delete seller
exports.deleteSeller = async (req, res, next) => {
    try {
        verifyIdWithToken(req.params.sellerId, req.user._id);
        const seller = await UserModel.findOne({
            _id: req.user._id, is_deleted: false
        });
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        const deletedSeller = await UserModel.findOneAndUpdate({
            _id: req.user._id, is_deleted: false
        }, { is_deleted: true }, { new: true });
        res.status(200).json({
            success: true,
            data: deletedSeller
        });
    } catch (error) {
        next(error);
    }
};

// Make Seller Approved
exports.makeSellerApproved = async (req, res, next) => {
    if (req.user.status === "approved") {
        return res.status(400).json({
            success: false,
            message: 'Seller already approved'
        });
    }

    try {
        verifyIdWithToken(req.params.sellerId, req.user._id);
        const seller = await UserModel.findOne({
            _id: req.user._id, is_deleted: false
        });
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        const approvedSeller = await UserModel.findOneAndUpdate(
            { _id: req.user._id, is_deleted: false },
            { status: "approved" },
            { new: true }
        );
        res.status(200).json({
            success: true,
            data: approvedSeller
        });
    } catch (error) {
        next(error);
    }
};

// Make Seller Pending
exports.makeSellerPending = async (req, res, next) => {
    if (req.user.status === "pending") {
        return res.status(400).json({
            success: false,
            message: 'Seller already pending'
        });
    }

    try {
        verifyIdWithToken(req.params.sellerId, req.user._id);
        const seller = await UserModel.findOne({
            _id: req.user._id, is_deleted: false
        });
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        const pendingSeller = await UserModel.findOneAndUpdate(
            { _id: req.user._id, is_deleted: false },
            { status: "pending" },
            { new: true }
        );
        res.status(200).json({
            success: true,
            data: pendingSeller
        });
    } catch (error) {
        next(error);
    }
}

// Upload banner
exports.uploadBanner = async (req, res, next) => {
    if (req.file) {
        if (req.fileValidationError) {
            return res.status(400).json({
                status: 400, message: req.fileValidationError,
            });
        }

        try {
            if (req.user.image) {
                fs.unlink("src/assets/uploads/" + req.user.image, (err) => {
                    if (err) throw err;
                });

                fs.unlink("src/assets/uploads/thumbs/" + req.user.image, (err) => {
                    if (err) throw err;
                });
            }

            await UserModel.findOneAndUpdate(
                { _id: req.user._id, is_deleted: false },
                { image: req.file.filename }
            );

            await sharp(req.file.path, { failOnError: false })
                .resize(128, 128)
                .withMetadata()
                .toFile(path.resolve(`src/assets/uploads/thumbs/${req.file.filename}`))

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


    // try {
    //     const seller = await UserModel.findOne({
    //         _id: req.user._id, is_deleted: false
    //     });
    //     if (!seller) {
    //         return res.status(404).json({
    //             success: false,
    //             message: 'Seller not found'
    //         });
    //     }

    //     await UserModel.findOneAndUpdate(
    //         { _id: req.user._id, is_deleted: false },
    //         { shop_banner: req.file.filename }
    //     );

    //     res.status(200).json({
    //         success: true,
    //         data: updatedSeller
    //     });
    // } catch (error) {
    //     next(error);
    // }
}