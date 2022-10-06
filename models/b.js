const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BModel = mongoose.model('b', new Schema({
    title: String,
    cId: { type: Schema.Types.ObjectId, ref: 'c' },
}));

module.exports = BModel;
