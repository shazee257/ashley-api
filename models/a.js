const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AModel = mongoose.model('a', new Schema({
    title: String,
    bId: { type: Schema.Types.ObjectId, ref: 'b' },
}));

module.exports = AModel;