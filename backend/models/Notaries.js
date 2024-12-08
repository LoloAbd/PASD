const mongoose = require('mongoose');

const NotariesSchema = new mongoose.Schema({
    num: { type: Number, required: true },
    name: { type: String, required: true }
});



const NotariesModel = mongoose.model("Notaries", NotariesSchema);
module.exports = NotariesModel;