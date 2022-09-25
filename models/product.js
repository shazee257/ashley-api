const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new Schema(
    {
        title: String,
        slug: { type: String, slug: 'title', unique: true },
        category_id: { type: Schema.Types.ObjectId, ref: 'category', required: true },
        brand_id: { type: Schema.Types.ObjectId, ref: 'brand', required: true },
        store_id: { type: Schema.Types.ObjectId, ref: 'store', required: true },
        is_featured: { type: Boolean, default: false },

        variants: [{
            description: String,
            dimensions: String,
            size: String,
            sale_price: Number,
            purchase_price: Number,
            features: [{
                color_id: { type: Schema.Types.ObjectId, ref: 'color' },
                quantity: Number,
                sku: String,
                images: [String],
                zero_stock_msg: String,
            }],
            // color_id: { type: Schema.Types.ObjectId, ref: 'color' },
            // quantity: Number,
            // sku: String,
            // images: [String],
        }],

        // for variable product (sizes and colors)
        is_sizes_with_colors: { type: Boolean, default: false },
        // for only colors
        is_colors_only: { type: Boolean, default: false },
        // for only sizes
        is_sizes_only: { type: Boolean, default: false },

        is_addon: { type: Boolean, default: false },
        addon: { type: String, price: Number },

        // discount in percentage
        discount: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        // online_only: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

productSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

module.exports = mongoose.model('product', productSchema);
