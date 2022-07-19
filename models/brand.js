const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const brandSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        slug: { type: String, slug: 'title', unique: true },
        description: String,
        image: String,
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

brandSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

brandSchema.virtual('id').get(function () {
    return this._id;
});

brandSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('brand', brandSchema);

