// Requires
let mongoose = require("mongoose"), 
    jwt = require("jsonwebtoken"),
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

 // Generate a token
EntitySchema.statics.generateJWT = (data, options) => {
    
    if (options){
        return jwt.sign(
            data,
            process.env.ENTITY_TOKEN_SECRET,
            options
        );
    }else{
        return jwt.sign(
            data,
            process.env.ENTITY_TOKEN_SECRET,
            {  }
        );
    }
    
    
}

// Verify the token
EntitySchema.statics.verifyJWT = (token) => {
    return jwt.verify(token, process.env.ENTITY_TOKEN_SECRET,{})   
}
// The model
var Entity = mongoose.model('entity', EntitySchema);


let find_elem = ()=>{
    Entity.findOne({_id: "5cdbce837dfdac10fdd9ea4a"}, (err, entity) => {
        if (entity) {
            console.log(entity);
            
            let token = Entity.generateJWT({
                entity_name: entity.entity_name,
                entity_type: entity.entity_type,
                entity_mac: entity.entity_mac,
                
                c_manager: entity.c_manager,
                operator: entity.operator,
                pool_name: entity.pool_name
            })
            console.log(token);
            
        }
    })
}
//find_elem()
//Exporting the model from the schema
module.exports = Entity