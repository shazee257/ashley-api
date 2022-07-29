const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
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
        cartTotal: Number,
    },
    { timestamps: true }
);

cartSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v'];
        delete ret['updatedAt'];
        return ret;
    }
})

cartSchema.virtual('id').get(function () {
    return this._id;
});

cartSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model("cart", cartSchema);