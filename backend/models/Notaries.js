const mongoose = require('mongoose');

const NotariesSchema = new mongoose.Schema({
    name: { type: String, required: true }
});



const NotariesModel = mongoose.model("Notaries", NotariesSchema);
module.exports = NotariesModel;