// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let EntitySchema = new Schema({
    tarck_id: String,

    entity_type: String,
    entity_name: String,
    pool_name: String,
    
    location_history:[]
}) 

/**
 * Entity methodes
 */ 


// The model
var Entity = mongoose.model('entity', EntitySchema);



//Exporting the model from the schema
module.exports = Entity