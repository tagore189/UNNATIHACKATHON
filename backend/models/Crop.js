const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    soilType: { type: String, required: true },
    season: { type: String, required: true },
    location: { type: String },
    waterRequirement: { type: String }, // e.g. "Moderate", "High"
    growingPeriod: { type: String }, // e.g. "90-120 days"
    description: { type: String },
    tips: { type: [String] }
});

module.exports = mongoose.model('Crop', cropSchema);
