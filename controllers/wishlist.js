const wishlistModel = require('../models/wishlist');

// Add item to wishlist
exports.addToWishlist = async (req, res, next) => {
    try {
        // if wishlist exists, add product to wishlist
        const wishlist = await wishlistModel.findOne({ user_id: req.params.userId });

        if (wishlist) {
            const isProductExist = wishlist.product_ids.includes(req.params.productId);

            // isProductExist = true in wishlist
            if (isProductExist) {
                res.status(200).json({
                    message: 'Product already in wishlist'
                });
            } else {
                wishlist.product_ids.push(req.params.productId);
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
                product_ids: [req.params.productId]
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
                message: 'Wishlist found',
                wishlist: wishlist.product_ids
            });
        } else {
            res.status
            res.status(404).json({
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
            const index = wishlist.product_ids.indexOf(req.params.productId);
            wishlist.product_ids.splice(index, 1);
            await wishlist.save();
            res.status(200).json({
                message: 'Product removed from wishlist successfully'
            });
        } else {
            res.status(404).json({
                message: 'Wishlist not found'
            });
        }
    } catch (error) {
        next(error);
    }
}
