const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        // common fields
        first_name: { type: String, default: '' },
        last_name: { type: String, default: '' },
        email: { type: String, unique: true, required: true, lowercase: true },
        role: { type: String, enum: ['customer', 'store', 'admin', 'seller', 'user'], default: 'customer' },
        phone_no: { type: String, default: '' },
        image: { type: String },
        alternet_phone_no: { type: String, default: '' },
        password: { type: String, required: true },

        email_confirmation_token: { type: String },
        is_verified: { type: Boolean, default: false },

        reset_password_token: String,
        reset_token_expires: { type: Date },
        address_ids: [{ type: Schema.Types.ObjectId, ref: 'address' }],
        is_deleted: { type: Boolean, default: false },

        email_subscription: { type: Boolean, default: true },

        // for store user
        store_id: { type: Schema.Types.ObjectId, ref: 'store' },

        token: { type: String },

    },
    { timestamps: true }
);

userSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('user', userSchema);


