const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        description: String,
        url: String,
        image: String,
        is_active: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

bannerSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

bannerSchema.virtual('id').get(function () {
    return this._id;
});

bannerSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('banner', bannerSchema);

