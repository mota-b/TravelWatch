let router = require('express').Router(),
    
    Entity = require("../../../model/EntityOfInterestModel"),
    {restriction_0_1A, restriction_0_1A_2A} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0_1A, (req, res, next) => {
    res.json({error : {message: "not activated yet"}})
})

// Read List
router.get("/", restriction_0_1A_2A, (req, res, next) => {
    // Return Users list
    Entity.find({}, (err, entities) => {
        if (entities){
            let data = [];
            entities.forEach( (entity) => {
                data.push({
                    _id: user._id,
                    entity_name: entity.entity_name,
                    entity_type: entity.entity_type,
                    
                    c_manager: entity.c_manager,
                    operator: entity.operator,
                    pool_name: entity.pool_name,
                    // TODO => populate location_history
                })
            });

            let entity_schema = [
                "_id",
                "entity_name",
                "entity_type",
                
                "c_manager",
                "operator",
                "pool_name"
            ]

            res.json({collection: data, schema: entity_schema})
        }
    })
})


// Read One
router.get("/:id", restriction_0_1A_2A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Entity.findById(id, (err, entity) => {
            if(user){
                res.json(entity)
            }
        })
    }else{console.log(req.params, id);
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
                res.json({isDeleted:true})
            }else{
                res.json({isDeleted:false})
            }
            
        }
    )
    
})




  

module.exports = router