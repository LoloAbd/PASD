const mongoose = require('mongoose');

const CountriesSchema = new mongoose.Schema({
    country_name: { type: String, required: true }
});



const CountriesModel = mongoose.model("countries", CountriesSchema);
module.exports = CountriesModel;