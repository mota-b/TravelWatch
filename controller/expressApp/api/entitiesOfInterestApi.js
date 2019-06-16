let router = require('express').Router(),
    
    Entity = require("../../../model/EntityOfInterestModel"),
    CompanyManager = require("../../../model/CompanyManagerModel"),
    Operator = require("../../../model/OperatorModel"),
    Location = require("../../../model/LocationModel"),
    {restriction_0_1A, restriction_0_1A_2A} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0_1A, (req, res, next) => {
    // Get the json Item
    let newItem = JSON.parse(req.body.newItem)
    
    
    // Check if the manager exist
    CompanyManager.findById(newItem.c_manager, (err, c_manager) => {
        if (c_manager){
            Operator.findById(newItem.operator, (err, operator) => {
                if (operator){
                    // Create the new Operator
                    let newEntity = new Entity({
                        entity_name: newItem.entity_name,
                        entity_type: newItem.entity_type,
                        entity_mac: newItem.entity_mac,
                        
                        c_manager: newItem.c_manager,
                        operator: newItem.operator,
                        pool_name: newItem.pool_name,

                        locationHistory: []
                    })
            
            
                    // Save the document (new Creation)
                    newEntity.save()
        

                    // Bind the new Entity to the manager
                    c_manager.entities.push(newEntity._id)
                    c_manager.save()

                    // Bind the new Entity to the operator
                    operator.entities.push(newEntity._id)
                    operator.save()

                    let token = Entity.generateJWT({
                        entity_name: newEntity.entity_name,
                        entity_type: newEntity.entity_type,
                        entity_mac: newEntity.entity_mac,
                        
                        c_manager: newEntity.c_manager,
                        operator: newEntity.operator,
                        pool_name: newEntity.pool_name
                    })

          
            
                    res.json({
                        isCreated : true, 
                        _id: newEntity._id, 
                        entity_token: token 
                    })      

                }else{
                    res.json({isCreated : false, message:"not a valid operator used"})
                }
            })
        }else{
            res.json({isCreated : false, message:"not a valid manager used"})
        }



    })
})

// Read List
router.get("/", restriction_0_1A_2A, (req, res, next) => {
    // Return entitys list
    Entity.find({}, (err, entities) => {
        if (entities){
            let data = [];
            entities.forEach( (entity) => {
                data.push({
                    _id: entity._id,
                    entity_name: entity.entity_name,
                    entity_type: entity.entity_type,
                    entity_mac: entity.entity_mac,
                    entity_token: Entity.generateJWT({

                        _id: entity._id,
                        entity_name: entity.entity_name,
                        entity_type: entity.entity_type,
                        entity_mac: entity.entity_mac,
                        
                        c_manager: entity.c_manager,
                        operator: entity.operator,
                        pool_name: entity.pool_name
                    }),
                    
                    c_manager: entity.c_manager,
                    operator: entity.operator,
                    pool_name: entity.pool_name,
                    location_history: entity.location_history
                })
            });

            let entity_schema = [
                "_id",
                "entity_name",
                "entity_type",
                "entity_mac",
                
                
                
                
                "c_manager",
                "operator",
                "pool_name"
            ],
            new_item_schema = {
                entity_name: "",
                entity_type: "",
                entity_mac: "",
                
                c_manager: "",
                operator: "",
                pool_name: "",
                
            }

            res.json({collection: data, schema: entity_schema, new_item_schema: new_item_schema})
        }
    })
})


// Read One
router.get("/:id", restriction_0_1A_2A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Entity.findById(id, (err, entity) => {
            if(entity){
                res.json(entity)
            }
        })
    }else{
        res.json({err: true, message: "no valid parameters"})
    }
    
})
    
// Update
router.put("/:id", restriction_0_1A_2A, (req, res, next) => {
    
    let {update} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(update)     

    Entity.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, entity) =>{
            if(!err){
                res.json({isUpdated:true})
            }else{
                res.json({isUpdated:false})
            }
            
        }
    )

    
})

// Delete
router.delete("/:id", restriction_0_1A, (req, res, next) => {

    let  {id} = req.params

    Entity.findOneAndDelete(
        {_id: id},
        (err, entity) =>{
            if(!err){

                 // Remove the entity from the c_manager entities list
                 CompanyManager.findById(entity.c_manager, (err, c_manager) =>{
                    
                    if(!err && c_manager){
                        let indexRemove = c_manager.entities.indexOf(entity._id)
                        c_manager.entities.splice(indexRemove, 1)
                        c_manager.save()
                    }
                    
                })
                 // Remove the entity from the operator entities list
                 Operator.findById(entity.operator, (err, operator) =>{
                    
                    if(!err && operator){
                        let indexRemove = operator.entities.indexOf(entity._id)
                        operator.entities.splice(indexRemove, 1)
                        operator.save()
                    }
                    
                })

                // remove the locations cascading from the location_history list in the entity
                entity.location_history.forEach((location_id)=>{
                    
                    Location.findOneAndDelete({_id: location_id}, (err, location) =>{
                    })
                })


                res.json({isDeleted:true})
            }else{
                res.json({isDeleted:false})
            }
            
        }
    )
    
})




  

module.exports = router