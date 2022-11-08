const CartModel = require('../models/cart');
const { generateResponse } = require('../utils/utils');

// Add to Cart
exports.addToCart = async (req, res, next) => {
    try {
        const {
            product_id,
            title, size, color, sku, price, quantity, image
        } = req.body;

        const cart = await CartModel.findOne({ user_id: req.params.userId });

        if (cart) {
            const product = cart.products.find((p) => p.sku === sku);

            if (product) {
                return generateResponse(false, 409, null, 'Product already in cart', res);
            }
            cart.products.push({
                product_id,
                title, size, color, sku, price, quantity, image,
                total: Number(quantity) * Number(price),

            });
            cart.cartTotal = cart.products.reduce((acc, cur) => acc + cur.total, 0);
            await cart.save();
            generateResponse(true, 200, cart, 'Product added to cart.', res);

        } else {
            const newCart = new CartModel({
                user_id: req.params.userId,
                products: [{
                    product_id,
                    title, size, color, sku, price, quantity, image,
                    total: Number(quantity) * Number(price),

                }],
                cartTotal: Number(quantity) * Number(price),
            });
            await newCart.save();
            generateResponse(true, 200, newCart, 'Product added to cart.', res);
        }

    } catch (error) {
        next(error);
    }
}

// Get Cart
exports.getCart = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const cart = await CartModel.findOne({ user_id: userId });

        if (cart) generateResponse(true, 200, cart, 'Cart fetched successfully', res);
        else generateResponse(false, 404, null, 'Cart not found', res);
    } catch (error) {
        next(error);
    }
}

// Update Cart by index
exports.updateCart = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { cartItemId, operation, quantity } = req.body;

        const cart = await CartModel.findOne({ user_id: userId });

        if (cart) {
            const product = cart.products.find((p) => p._id.toString() === cartItemId);
            if (product) {
                if (operation === 'increment') {
                    product.quantity = Number(quantity) + 1;
                    product.total = product.quantity * product.price;
                } else if (operation === 'decrement') {
                    product.quantity = Number(quantity) - 1;
                    product.total = product.quantity * product.price;
                }
                cart.cartTotal = cart.products.reduce((acc, cur) => acc + cur.total, 0);
                await cart.save();
                generateResponse(true, 200, cart, 'Cart updated successfully', res);
            } else generateResponse(false, 404, null, 'Product not found', res);
        } else generateResponse(false, 404, null, 'Cart not found', res);

    } catch (error) {
        next(error);
    }
}

// Delete Cart Item by index
exports.removeCartItem = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { cartProductId } = req.body;

        const cart = await CartModel.findOne({ user_id: userId });

        if (cart) {
            cart.products = cart.products.filter((p) => p._id.toString() !== cartProductId);
            cart.cartTotal = cart.products.reduce((acc, cur) => acc + cur.total, 0);
            await cart.save();
            generateResponse(true, 200, cart, 'Item removed from cart', res);
        } else generateResponse(false, 404, null, 'Cart not found', res);
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