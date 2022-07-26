const CartModel = require('../models/cart');

// Add to Cart
exports.addToCart = async (req, res, next) => {
    try {
        const {
            user_id,
            product_id,
            title, size, color, sku, price, quantity, image
        } = req.body;

        const cart = await CartModel.findOne({ user_id });

        if (cart) {
            const product = cart.products.find((p) => p.sku === sku);

            if (product) {
                product.quantity += Number(quantity);
                product.price = product.quantity * price;
            } else {
                cart.products.push({
                    product_id,
                    title, size, color, sku, price, quantity, image
                });
            }

            await cart.save();
        } else {
            const newCart = new CartModel({
                user_id,
                products: [{
                    product_id,
                    title, size, color, sku, price, quantity, image
                }],
            });

            await newCart.save();
        }

        res.status(200).json({
            message: 'Product added to cart successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Get Cart
exports.getCart = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const cart = await CartModel.findOne({ user_id: userId });

        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart,
        });
    } catch (error) {
        next(error);
    }
}

// Update Cart by index
exports.updateCart = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { index, quantity } = req.body;

        const cart = await CartModel.findOne({ user_id: userId });

        if (cart) {
            cart.products[index].quantity = Number(quantity);
            cart.products[index].price *= cart.products[index].quantity;

            await cart.save();

            res.status(200).json({
                message: 'Cart updated successfully',
            });
        } else {
            res.status(404).json({
                message: 'Cart not found',
            });
        }
    } catch (error) {
        next(error);
    }
}

// Delete Cart Item by index
exports.removeCartItem = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { index } = req.body;

        const cart = await CartModel.findOne({ user_id: userId });

        if (cart) {
            cart.products.splice(index, 1);

            await cart.save();

            res.status(200).json({
                message: 'Cart updated successfully',
            });
        } else {
            res.status(404).json({
                message: 'Cart not found',
            });
        }
    } catch (error) {
        next(error);
    }
}

// Delete Cart
exports.deleteCart = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const cart = await CartModel.findOne({ user_id: userId });

        if (cart) {
            await cart.remove();
        }

        res.status(200).json({
            message: 'Cart deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}