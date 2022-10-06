const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DModel = mongoose.model('d', new Schema({
    title: String,
}));

module.exports = DModel;