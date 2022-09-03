const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    title: String,
    description: String,
    images: [String],
    rating: { type: Number, min: 0, max: 5 },
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
    product_id: { type: Schema.Types.ObjectId, ref: 'product' },
    is_deleted: { type: Boolean, default: false }
},
    { timestamps: true }
);

reviewsSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

reviewsSchema.virtual('id').get(function () {
    return this._id;
});

reviewsSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('reviews', reviewsSchema);

