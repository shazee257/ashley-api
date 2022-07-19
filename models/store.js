const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const storeSchema = new Schema(
    {
        title: String,
        slug: { type: String, slug: 'title', unique: true },
        banner: String,
        phone_no: String,
        email: String,
        address: String,
        city: String,
        state: String,
        zip: Number,
        country: String,
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

storeSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

storeSchema.virtual('id').get(function () {
    return this._id;
});

storeSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('store', storeSchema);


