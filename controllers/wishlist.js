const wishlistModel = require('../models/wishlist');

// Add item to wishlist
exports.addToWishlist = async (req, res, next) => {
    try {
        // if wishlist exists, add product to wishlist
        const wishlist = await wishlistModel.findOne({ user_id: req.params.userId });

        if (wishlist) {
            const isProductExist = wishlist.product_ids.includes(req.body.productId);

            // isProductExist = true in wishlist
            if (isProductExist) {
                res.status(200).json({
                    success: true,
                    message: 'Product already in wishlist'
                });
            } else {
                wishlist.product_ids.push(req.body.productId);
                await wishlist.save();
                return res.status(200).json({
                    success: true,
                    message: 'Product added to wishlist successfully'
                });
            }
        } else {
            // if wishlist doesn't exist, create new wishlist
            const newWishlist = new wishlistModel({
                user_id: req.params.userId,
                product_ids: [req.body.productId]
            });
            await newWishlist.save();
        }
        res.status(200).json({
            success: true,
            message: 'Product added to wishlist successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Get wishlist
exports.getWishlist = async (req, res, next) => {
    try {
        const wishlist = await wishlistModel.findOne({ user_id: req.params.userId })
            .populate('product_ids');

        if (wishlist) {
            res.status(200).json({
                success: true,
                wishlist: wishlist.product_ids,
                wishlistCount: wishlist.product_ids.length
            });
        } else {
            res.status
            res.status(404).json({
                wishlist: [],
                wishlistCount: 0,
                message: 'Wishlist not found'
            });
        }
    } catch (error) {
        next(error);
    }
}

// Remove item from wishlist
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const wishlist = await wishlistModel.findOne({ user_id: req.params.userId });

        if (wishlist) {
            const index = wishlist.product_ids.indexOf(req.body.productId);
            if (index > -1) {
                wishlist.product_ids.splice(index, 1);
                await wishlist.save();
                res.send({
                    success: true,
                    status: 200,
                    message: 'Product removed from wishlist successfully'
                });
            } else {
                res.send({
                    success: false,
                    status: 404,
                    message: 'Product not found in wishlist'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                status: 404,
                message: 'Wishlist not found'
            });
        }
    } catch (error) {
        next(error);
    }
}
