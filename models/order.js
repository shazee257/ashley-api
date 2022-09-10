const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        payment_id: String,

        user_id: { type: Schema.Types.ObjectId, ref: "user" },
        customer_name: String,
        customer_email: String,
        customer_phone: String,

        shipping_address: {
            first_name: String,
            last_name: String,
            address: String,
            unit: String,
            city: String,
            state: String,
            zip_code: String,
            phone_no: String,
        },
        products: [{
            title: String,
            size: String,
            color: String,
            sku: String,
            price: Number,
            quantity: Number,
            image: String,
            total: Number,
            product_id: { type: Schema.Types.ObjectId, ref: 'product' },
        }],
        shipping_price: { type: Number, default: 0 },
        total_amount: Number,
        status: { type: String, enum: ["processing", "delivered", "cancelled"] },
    },
    { timestamps: true }
);

orderSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v'];
        delete ret['updatedAt'];
        return ret;
    }
})

orderSchema.virtual('id').get(function () {
    return this._id;
});

orderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model("order", orderSchema);