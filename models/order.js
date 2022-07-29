const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        orderDate: { type: Date, default: Date.now },
        customer_name: String,
        customer_email: String,
        customer_phone: String,
        address: {
            first_name: String,
            last_name: String,
            address: String,
            unit: String,
            city: String,
            state: String,
            zip_code: String,
            phone_no: String,
        },

        user_id: { type: Schema.Types.ObjectId, ref: "user" },
        products: [{
            title: String,
            size: String,
            color: String,
            sku: String,
            price: Number,
            quantity: Number,
            image: String,
            total: Number,
            product_id: { type: Schema.Types.ObjectId, ref: "product" },
        }],

        orderTotal: Number,

        orderStatus: { type: String, enum: ["pending", "processing", "delivered", "cancelled"] },
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

module.exports = mongoose.model("cart", orderSchema);