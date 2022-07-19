const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema(
    {
        address_name: String,
        first_name: String,
        last_name: String,
        address: String,
        unit: String,
        city: String,
        state: String,
        zip_code: String,
        phone_no: String,
        alternet_phone_no: String,
    },
    { timestamps: true }
);

addressSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

module.exports = mongoose.model('address', addressSchema);


