const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colorSchema = new Schema(
    {
        title: { type: String, unique: true, required: true },
        image: { type: String, required: true },
        is_deleted: { type: Boolean, default: false }
    },
);

colorSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

colorSchema.virtual('id').get(function () {
    return this._id;
});

colorSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('color', colorSchema);