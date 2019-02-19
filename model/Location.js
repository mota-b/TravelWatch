// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let LocationSchema = new Schema({
    entity_id: String,

    date: {
        day: String,
        month: String,
        year: String,
        time: String,  
    },
    lat_long:{
        latitude: String,
        longitude: String
    },
    asimuth: String
}) 

/**
 * Location methodes
 */ 



// The model
var LocationModel = mongoose.model('location', LocationSchema);


//Exporting the model from the schema
module.exports = LocationModel;