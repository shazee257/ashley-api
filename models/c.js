const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CModel = mongoose.model('c', new Schema({
    title: String,
    dId: { type: Schema.Types.ObjectId, ref: 'd' }
}));

exports.saveC = async (obj) => {
    const c = new CModel(obj);
    return await c.save();
}

exports.fetchAllC = async (query) => {
    return await CModel.find(query);
}

