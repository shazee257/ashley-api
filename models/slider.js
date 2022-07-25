const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sliderSchema = new Schema(
    {
        title: String,
        sub_title: String,
        description: String,
        image: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

sliderSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

sliderSchema.virtual('id').get(function () {
    return this._id;
});

sliderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('slider', sliderSchema);