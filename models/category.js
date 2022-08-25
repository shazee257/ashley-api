const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const categorySchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        slug: { type: String, slug: 'title', unique: true },
        image: String,
        discount_image: String,
        parent_id: String,
        attributes: [String],
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

categorySchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

categorySchema.virtual('id').get(function () {
    return this._id;
});

categorySchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('category', categorySchema);