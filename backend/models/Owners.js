const mongoose = require('mongoose');

const OwnersSchema = new mongoose.Schema({
    owner_id: { type: Number, required: true },
    owner_name: { type: String, required: true }
});



const OwnersModel = mongoose.model("owners", OwnersSchema);
module.exports = OwnersModel;