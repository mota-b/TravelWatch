let router = require('express').Router(),
    
    Entity = require("../../../model/EntityOfInterestModel"),
    Location = require("../../../model/LocationModel"),
    {restriction_0_1A, restriction_0_1A_2A} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0_1A, (req, res, next) => {
    // Get the json Item
    let newItem = JSON.parse(req.body.newItem)
    
    
    // Check if the entity exist
    Entity.findById(newItem.entity_id, (err, entity) => {
        if (entity){

            // Operator.findById(newItem.operator, (err, operator) => {
                // if (operator){
                    // Create the new Operator
                    let newLocation = new Location({
                        entity_id: newItem.entity_id,
                        provider: newItem.provider,
                        date: newItem.date,
                        lat_lon: newItem.lat_lon,
                        altitude: newItem.altitude,
                        asimuth: newItem.asimuth,
                        speed: newItem.speed,
                        time: newItem.time
                    })
            
            
                    // Save the document (new Creation)
                    newLocation.save()
        

                    // Bind the new  location to the Entity
                    entity.location_history.push(newLocation._id)
                    entity.save()

                
            
                    res.json({
                        isCreated : true, 
                        _id: newLocation._id, 
                    })      

            //     }else{
            //         res.json({isCreated : false, message:"not a valid operator used"})
            //     }
            // })
        }else{
            res.json({isCreated : false, message:"not a valid entity used"})
        }



    })
})

// Read List
router.get("/", restriction_0_1A_2A, (req, res, next) => {
    // Return entitys list
    Location.find({}, (err, locations) => {
        if (locations){
            let data = [];
            locations.forEach( (location) => {
                data.push(location)
            });

            let location_schema = [
                "entity_id",
                "provider",
                "date",
                "altitude",
                "asimuth",
                "speed",
                "time"
            ],
            new_item_schema = {
                entity_id:"",
                provider: "",
                date: "",
                lat_lon: {
                    lat: "",
                    lng: ""
                },
                altitude: "",
                asimuth: "",
                speed: "",
                time: ""
            }

            res.json({collection: data, schema: location_schema, new_item_schema: new_item_schema})
        }
    })
})


// Read One
router.get("/:id", restriction_0_1A_2A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Location.findById(id, (err, location) => {
            if(location){
                res.json(location)
            }
        })
    }else{
        res.json({err: true, message: "no valid parameters"})
    }
    
})
    

// Delete
router.delete("/:id", restriction_0_1A, (req, res, next) => {

    let  {id} = req.params

    Location.findOneAndDelete(
        {_id: id},
        (err, location) =>{
            if(!err){

                 // Remove the entity from the c_manager entities list
                 Entity.findById(location.entity_id, (err, entity) =>{
                    
                    if(!err && entity){
                        let indexRemove = entity.location_history.indexOf(location._id)
                        entity.location_history.splice(indexRemove, 1)
                        entity.save()
                    }
                    
                })
                


                res.json({isDeleted:true})
            }else{
                res.json({isDeleted:false})
            }
            
        }
    )
    
})




  

module.exports = router