const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "user" },
        product_ids: [{ type: Schema.Types.ObjectId, ref: "product" }],
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("wishlist", wishlistSchema);