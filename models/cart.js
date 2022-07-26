const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        products: [
            {
                title: String,
                size: String,
                color: String,
                sku: String,
                price: Number,
                quantity: Number,
                image: String,
                product_id: { type: Schema.Types.ObjectId, ref: "product" },
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);