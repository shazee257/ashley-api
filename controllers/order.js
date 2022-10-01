const OrderModel = require('../models/order');
const ProductModel = require('../models/product');

// create order
exports.createOrder = async (req, res, next) => {
    try {
        const {
            // user or customer info
            user_id,
            customer_name, customer_email, customer_phone,

            // shipping address object
            shipping_address,

            // products and total amount
            products, shipping_price, total_amount,
            status
        } = req.body;

        const order = new OrderModel({
            user_id, customer_name, customer_email, customer_phone,
            shipping_address,
            products,
            shipping_price, total_amount,
            status
        });

        products.forEach(async (p) => {
            await ProductModel.findByIdAndUpdate(p.product_id,
                { $inc: { "variants.$[v].features.$[f].quantity": -p.quantity } },
                {
                    arrayFilters: [
                        { "v.size": p.size },
                        { "f.sku": p.sku }
                    ],
                });
        });

        await order.save();

        res.status(200).json({
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
}

// get order by user
exports.getOrdersByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const orders = await OrderModel.find({ user_id: userId });

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders,
        });
    } catch (error) {
        next(error);
    }
}

// get all orders for dashboard
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders,
        });
    } catch (error) {
        next(error);
    }
}

// order tracking
exports.orderTracking = async (req, res, next) => {
    try {
        const { order_id, email } = req.body;

        const order = await OrderModel.findOne({ _id: order_id, customer_email: email });

        res.status(200).json({
            message: 'Order status retrieved successfully',
            order_status: {
                status: order.status,
                lastUpdated: order.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
}