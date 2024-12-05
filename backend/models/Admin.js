const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    username: { type: String, required: true, unique: true }, // Fixed typo in "unique"
    password: { type: String, required: true }
});



const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;
