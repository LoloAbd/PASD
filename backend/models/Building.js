// Schema and Model
const mongoose = require('mongoose');


const buildingSchema = new mongoose.Schema({
  Name: String,
  ArchitectID: Number,
  LocationID: String,
  DOC: Number,
  BuildingDetail: String
  
});

const BuildingModel = mongoose.model("Building", buildingSchema);
module.exports = BuildingModel;