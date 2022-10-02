const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponsSchema = new Schema(
    {
        code: { type: String, required: true, unique: true },
        discount: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// upper case the code before saving
couponsSchema.pre('save', function (next) {
    this.code = this.code.toUpperCase();
    next();
});


module.exports = mongoose.model('coupons', couponsSchema);