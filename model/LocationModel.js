// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let LocationSchema = new Schema({
    entity_id: String,

    provider: String,
    date: String,
    lat_lon:{
        lat: String,
        lng: String
    },
    altitude: String,
    accuracy:String,
    asimuth: String,
    speed: String,
    time: String,
    satellistes: String
}) 

/**
 * Location methodes
 */ 


 

// The model
var LocationModel = mongoose.model('location', LocationSchema);


// Fast create element
let fastElem = () => {
    newElem = new LocationModel({
        entity_id: "test",

        provider: "gps",
        date: "2020/02/20;10:10:10",
        lat_lon:{
            lat: "10",
            lng: "-5"
        },
        altitude: 2500,
        asimuth: 300,
        speed: 0.001,
        time: "2165423541654135"
    })
    
    newElem.save((err, user) => {
        if(user){
            console.log("yes !!");
            console.log(err);
            
        }else{
            console.log("err !!");
            console.log(err);  
        }
    })
}
// fastElem()


//Exporting the model from the schema
module.exports = LocationModel;