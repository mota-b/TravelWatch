// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let TrackSchema = new Schema({
    track_name: String, 
    entity_ids: []
}) 

/**
 * Track methodes
 */ 



// The model
var Track = mongoose.model('track', TrackSchema);


//Exporting the model from the schema
module.exports = Track;