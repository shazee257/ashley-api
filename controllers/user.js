const UserModel = require('../models/user');
const SessionModel = require('../models/session');
const AddressModel = require('../models/address');
var crypto = require("crypto");
const bcrypt = require('bcrypt');
const { comparePassword, verifyIdWithToken } = require("../utils/utils");
const moment = require("moment");
const { transporter } = require('../utils/mailSender');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { thumbnail } = require('../utils/utils');

// Get user by id
exports.getUser = async (req, res) => {
    const user = await UserModel.findOne({ _id: req.params.userId, is_deleted: false })
        .populate('address_ids');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({ success: true, user });
};

// Get all users
exports.getUsers = async (req, res) => {
    const users = await UserModel.find({ is_deleted: false });
    res.status(200).json({ success: true, data: users });
};

// Get all admin users
exports.getAdminUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find({
            role: 'admin', is_deleted: false
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        next(error);
    }

}

// Register a user
exports.registerUser = async (req, res, next) => {
    if (!req.body.password || !req.body.confirm_password || !req.body.email) {
        return res.status(400).json({
            success: false,
            message: 'Empty fields are not allowed.'
        });
    }

    // password and confirm password should be same
    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm password should be same.'
        });
    }

    const userExisted = await UserModel.findOne({ email: req.body.email });
    if (userExisted) {
        return res.status(409).json({
            success: false,
            message: 'User already existed.'
        });
    }

    if (req.file) {
        req.body.image = req.file.filename
        thumbnail(req);
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    try {
        const user = await UserModel.create(req.body);
        res.status(200).json({
            success: true,
            user,
            message: "User is created successfully."
        });
    } catch (error) {
        next(error);
    }
};

// Delete a user by setting is_deleted = true
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.params.userId, is_deleted: false },
            { is_deleted: true }, { new: true });
        res.status(200).json({
            success: true,
            user,
            message: "User is deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

// Delete all users (is_deleted = true)
exports.deleteUsers = async (req, res) => {
    const users = await UserModel.updateMany({ _id: { $in: req.body.ids } }, { is_deleted: true });
    res.status(200).json({ success: true, data: users, message: 'Users deleted successfully' });
};

// Update a user
exports.updateUser = async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId, req.body, { new: true }
    );
    res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
    });
};

// Change password
exports.changePassword = async (req, res) => {
    // new password should not match with old password
    if (req.body.newPassword === req.body.oldPassword) {
        return res.status(400).json({
            status: 400,
            message: "New Password should be different from old password",
        });
    }

    const user = await UserModel.findOne({ _id: req.params.userId, is_deleted: false });
    if (!user) {
        return res.status(404).json({
            success: false, message: 'User not found'
        });
    }

    const isEqual = await comparePassword(
        req.body.oldPassword,
        user.password
    );

    if (!isEqual) {
        return res.status(400).json({
            status: 400, message: "Old Password is not correct",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.newPassword, salt);

    await UserModel.findByIdAndUpdate(req.param.userId, { password: password });
    res.status(200).json({ success: true, message: 'Password changed successfully' });
}

// Login
exports.loginUser = async (req, res) => {
    if (!req.body.password || !req.body.email) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields.'
        });
    }

    const user = await UserModel.findOne({ email: req.body.email, is_deleted: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const isEqual = await comparePassword(
        req.body.password,
        user.password
    );

    if (!isEqual) {
        return res.status(400).json({
            status: 400,
            message: "Incorrect password, please try again",
        });
    }

    const session = await SessionModel.create({
        token: crypto.randomBytes(16).toString("base64"),
        user_id: user._id,
        expiry_date: new Date(moment().add(process.env.SESSION_EXPIRY_DAYS, "days"))
    });

    res.status(200).json({
        success: true,
        user,
        session,
    });
}

// Forgot password
exports.forgotPassword = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            success: false,
            message: 'Please type your email.'
        });
    }

    const user = await UserModel.findOne({ email: req.body.email, is_deleted: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Email not found'
        });
    }

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            throw err;
        }
        const resetToken = buffer.toString("hex");
        user.reset_password_token = token;
        user.reset_token_expires = Date.now() + (24 * 3600000); // 24 hour

        user.save();
        const resetUrl = `${process.env.FRONTEND_URI}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset Password",
            html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="${resetUrl}">link</a> to set a new password.</p>
                    `
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is not sent', err
                });
            }
            res.status(200).json({
                success: true,
                message: 'Email sent',
            });
        });
    });
}

// Reset password
exports.resetPassword = async (req, res) => {
    const user = await UserModel.findOne({
        reset_password_token: req.params.resetToken, is_deleted: false
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        });
    }

    if (user.reset_token_expires < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'Token expired'
        });
    }

    res.status(200).json({
        success: true,
        userId: user._id,
    });
}

// New password
exports.newPassword = async (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm-password should be same.'
        });
    }

    const user = await UserModel.findOne({ _id: req.params.userId, is_deleted: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    user.password = password;
    user.reset_password_token = null;
    user.reset_token_expires = null;
    await user.save();

    res.status(200).json({ success: true, message: 'New password set successfully' });
}

// Create new Address
exports.createAddress = async (req, res) => {
    // if (!req.body.first_name || !req.body.last_name || !req.body.address || !req.body.unit ||
    //     !req.body.city || !req.body.state || !req.body.zip_code) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Please fill required fields.'
    //     });
    // }

    const user = await UserModel.findOne({ _id: req.params.userId, is_deleted: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const address = await AddressModel.create(req.body);
    await address.save();

    const updatedUser = await UserModel.findByIdAndUpdate(
        user._id, { $push: { address_ids: address._id } }, { new: true }
    );

    res.status(200).json({
        success: true,
        user: updatedUser,
        message: 'Address added successfully'
    });
}

// Update Address
exports.updateAddress = async (req, res) => {
    // if (!req.body.first_name || !req.body.last_name || !req.body.address || !req.body.unit ||
    //     !req.body.city || !req.body.state || !req.body.zip_code) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Please fill required fields.'
    //     });
    // }

    const address = await AddressModel.findOne({ _id: req.params.addressId });
    if (!address) {
        return res.status(404).json({
            success: false,
            message: 'Address not found'
        });
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
        req.params.addressId, req.body, { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        address: updatedAddress
    });
}

// Get Addresses
exports.getAddresses = async (req, res) => {
    const user = await UserModel.findOne({ _id: req.params.userId, is_deleted: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const addresses = await AddressModel.find({ _id: { $in: user.address_ids } });
    res.status(200).json({ success: true, data: addresses });
}

// Delete Address
exports.deleteAddress = async (req, res) => {
    const address = await AddressModel.findOne({ _id: req.params.addressId });
    if (!address) {
        return res.status(404).json({
            success: false, message: 'Address not found!'
        });
    }
    await AddressModel.findByIdAndDelete(req.params.addressId);

    // delele address_id from user
    await UserModel.findByIdAndUpdate(req.params.userId, { $pull: { address_ids: req.params.addressId } });
    res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
    });
}

// Upload Image & Thumbnails
exports.uploadUserImage = async (req, res) => {
    if (req.file) {
        if (req.fileValidationError) {
            return res.status(400).json({
                status: 400, message: req.fileValidationError,
            });
        }
        // let accessToken = req.get("Authorization");
        // if (accessToken) {
        //     const session = await SessionModel.findOne({
        //         token: accessToken,
        //         expiry_date: { $gte: new Date() },
        //     }).populate("user_id");
        //     if (!session) {
        //         res.status(403).json({
        //             success: false,
        //             error: "You're not authorized!"
        //         });
        //     }
        thumbnail(req);

        await UserModel.findOneAndUpdate(
            { _id: req.params.userId, is_deleted: false },
            { image: req.file.filename }
        );

        return res.status(200).json({
            success: true, message: 'Image uploaded successfully',
        });
    }

    return res.status(400).json({
        status: 400,
        message: "Please upload file.",
    });
}

// verify accessToken and return user
exports.verifyAccessToken = async (req, res) => {
    let accessToken = req.get("Authorization");

    const session = await SessionModel.findOne({
        token: accessToken,
        expiry_date: { $gte: new Date() },
    }).populate("user_id");

    if (!session) {
        return res.status(403).json({
            success: false,
            error: "You're not authorized!"
        });
    }

    res.status(200).json({
        success: true,
        user: session.user_id,
    });
}