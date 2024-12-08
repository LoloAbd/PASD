const mongoose = require('mongoose');

const CitiesSchema = new mongoose.Schema({
    country_id: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to the countries collection
        ref: "countries", // The name of the Countries model
        required: true 
    },
    city_name: { type: String, required: true , unique: true }
});



const CitiesModel = mongoose.model("cities", CitiesSchema);
module.exports = CitiesModel;