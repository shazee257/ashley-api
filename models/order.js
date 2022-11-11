const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        order_number: Number,
        // Customer info
        user_id: { type: Schema.Types.ObjectId, ref: "user" },
        first_name: String,
        last_name: String,
        email: String,
        phone: String,
        address: String,
        unit: String,
        city: String,
        state: String,
        zip: String,
        country: String,
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
        tax_amount: { type: Number, default: 0 },
        total_amount: Number,
        status: { type: String, enum: ["pending", "processing", "delivered", "cancelled"], default: "pending" },
    },
    { timestamps: true }
);

orderSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v'];
        return ret;
    }
})

module.exports = mongoose.model("order", orderSchema);