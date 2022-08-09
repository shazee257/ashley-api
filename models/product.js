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

        // for variable product (sizes and colors)
        is_sizes_with_colors: { type: Boolean, default: false },

        variants: [{
            description: String,
            dimensions: String,
            size: String,
            sale_price: Number,
            purchase_price: Number,
            features: [{
                color: String,
                quantity: Number,
                sku: String,
                images: [String],
            }],
            // for color only
            color: String,
            quantity: Number,
            sku: String,
            images: [String],
        }],

        // for only colors
        is_colors_only: { type: Boolean, default: false },
        // colors: [{
        //     color: String,
        //     sale_price: Number,
        //     purchase_price: Number,
        //     quantity: Number,
        //     sku: String,
        //     images: [String]
        // }],

        // for only sizes
        is_sizes_only: { type: Boolean, default: false },
        // sizes: [{
        //     size: String,
        //     sale_price: Number,
        //     purchase_price: Number,
        //     quantity: Number,
        //     sku: String,
        //     images: [String],
        //     detail_1: String,
        //     detail_2: String,
        // }],


        is_addon: { type: Boolean, default: false },
        addon: { type: String, price: Number },

        // discount in percentage
        discount: { type: Number, default: 0 },
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

productSchema.virtual('id').get(function () {
    return this._id;
});

productSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('product', productSchema);
