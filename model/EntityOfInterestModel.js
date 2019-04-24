// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let EntitySchema = new Schema({

    entity_name: String,
    entity_type: String,
    entity_mac: String,
    
    c_manager: String,
    operator: String,
    pool_name: String,
    
    location_history: Array
}) 

/**
 * Entity methodes
 */ 


// The model
var Entity = mongoose.model('entity', EntitySchema);



//Exporting the model from the schema
module.exports = Entity