const OrderModel = require('../models/order');

// Add to Cart
exports.addToCart = async (req, res, next) => {
    try {
        const {
            product_id,
            title, size, color, sku, price, quantity, image
        } = req.body;

        const cart = await OrderModel.findOne({ user_id: req.params.userId });
        let total = 0;

        // return console.log(cart);   
        if (cart) {
            const product = cart.products.find((p) => p.sku === sku);

            if (product) {
                product.quantity += Number(quantity);
                product.total = product.quantity * Number(price);
            } else {
                cart.products.push({
                    product_id,
                    title, size, color, sku, price, quantity, image,
                    total: Number(quantity) * Number(price),

                });
            }
            cart.cartTotal = cart.products.reduce((acc, cur) => acc + cur.total, 0);
            await cart.save();
        } else {
            const newCart = new OrderModel({
                user_id: req.params.userId,
                products: [{
                    product_id,
                    title, size, color, sku, price, quantity, image,
                    total: Number(quantity) * Number(price),

                }],
                cartTotal: total
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

        const cart = await OrderModel.findOne({ user_id: userId });

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

        const cart = await OrderModel.findOne({ user_id: userId });

        if (cart) {
            cart.products[index].quantity = Number(quantity);
            cart.products[index].total = cart.products[index].price * cart.products[index].quantity;
            cart.cartTotal = cart.products.reduce((acc, cur) => acc + cur.total, 0);

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

        const cart = await OrderModel.findOne({ user_id: userId });

        if (cart) {
            cart.products.splice(index, 1);
            cart.cartTotal = cart.products.reduce((acc, cur) => acc + cur.total, 0);

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

        const cart = await OrderModel.findOne({ user_id: userId });

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