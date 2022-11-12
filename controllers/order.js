const OrderModel = require('../models/order');
const ProductModel = require('../models/product');
const UserModel = require('../models/user');
const { chargeCreditCard } = require('../utils/chargeCreditCard');
const { generateResponse } = require('../utils/utils');

// create order
exports.createOrder = async (req, res, next) => {
    const customer = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        unit: req.body.unit,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
    }

    console.log("first_name", req.body.first_name);



    const {
        // user or customer info
        user_id,
        // products and total amount
        products, tax_amount, total_amount
    } = req.body;

    try {
        // create order
        const order = new OrderModel({
            user_id,
            ...customer,
            products,
            tax_amount, total_amount,
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
        // create unique order number
        const orderNumber = await OrderModel.countDocuments() + 1;
        order.order_number = orderNumber;
        await order.save();

        // console.log("order:  ", order);

        // find user from user_id   
        const billingUser = await UserModel.findById(user_id);

        console.log("billingUser:  ", billingUser);
        // charge credit card
        chargeCreditCard(order, billingUser, (response) => {
            if (response.messages.resultCode === "Ok") {
                generateResponse(true, 200, order, 'Payment received and Order created successfully', res);
            }
        });
    } catch (error) {
        next(error);
    }
}

// get order by user
exports.getOrdersByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await OrderModel.find({ user_id: userId }).sort({ createdAt: -1 }).lean();

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

