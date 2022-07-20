const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new Schema(
    {
        title: String,
        slug: { type: String, slug: 'title', unique: true },
        detail_1: String,
        detail_2: String,
        category_id: { type: Schema.Types.ObjectId, ref: 'category', required: true },
        brand_id: { type: Schema.Types.ObjectId, ref: 'brand', required: true },
        store_id: { type: Schema.Types.ObjectId, ref: 'store', required: true },

        // for variable size product
        is_variable: { type: Boolean, default: true },

        // for sizes and colors
        variants: [{
            size: String,
            price: Number,
            features: [{
                color: String,
                quantity: Number,
                sku: String,
                images: [String],
            }]
        }],

        // for only colors
        colors: [{
            color: String,
            quantity: Number,
            sku: String,
            images: [String]
        }],
        price: Number,

        is_addon: { type: Boolean, default: false },
        addon: { type: String, price: Number },

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
