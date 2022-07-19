const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
    {
        token: { type: String, required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "user", },
        expiry_date: Date,
    },
    { timestamps: true }
);

sessionSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['_id']
        delete ret['__v']
        delete ret['updatedAt']
        return ret
    }
})

module.exports = mongoose.model("session", sessionSchema);


