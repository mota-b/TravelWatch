let router = require('express').Router(),
    
    CompanyManager = require("../../../model/CompanyManagerModel"),
    {restriction_0, restriction_1A} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0, (req, res, next) => {

    // Get the json Item
    let newItem = JSON.parse(req.body.newItem); 
    
    // Create the new Item
    let newC_manager = new CompanyManager({
        company_name: newItem.company_name,
        username: newItem.username,
        email: newItem.email,
        password: CompanyManager.generatePassword(newItem.password),
        company_location: {
            lat: newItem.company_location.lat,
            lon: newItem.company_location.lon
        },
        isCompanyUnlocked: newItem.isCompanyUnlocked,
        
        operators: [],
        entities: [] 
    })

    // Save the document
    newC_manager.save().then(() =>{
        res.json({isCreated : true, _id: newC_manager._id})
    });

    
    
})

// Read List
router.get("/", restriction_0, (req, res, next) => {
    
    // Return Collection list
    CompanyManager.find({}, (err, c_managers) => {
        if (c_managers){
            let data = [];
            c_managers.forEach( (c_manager) => {
                data.push({
                    _id: c_manager._id,
                    company_name: c_manager.company_name,
                    username: c_manager.username,
                    email: c_manager.email,
                    company_location: c_manager.company_location,
                    isCompanyUnlocked: c_manager.isCompanyUnlocked
                    // TODO => populate operators
                    // TODO => populate entities of interest
                })
            });

            // Table display Schema
            let c_manager_schema = [
                "_id",
                "company_name",
                "username", 
                "email",
                "isCompanyUnlocked"
            ],
            // New Item Create Schema
            new_item_schema = { 
                company_name: "",
                username: "",
                email: "",
                password: "",
                company_location: {
                    lat: "",
                    lon: ""
                },
                isCompanyUnlocked: false
                // TODO => populate operators
                // TODO => populate entities of interest
            }

            // Return result
            res.json({collection: data, schema: c_manager_schema, new_item_schema: new_item_schema})
        }
    })
})

// Read One
router.get("/:id", restriction_0, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        CompanyManager.findById(id, (err, c_manager) => {
            if(c_manager){
                res.json(c_manager)
            }
        })
    }else{console.log(req.params, id);
    }
    
})
    
// Update
router.put("/:id", restriction_0, (req, res, next) => {
    
    let {update} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(update)     

    CompanyManager.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, c_manager) =>{
            if(!err){
                res.json({isUpdated:true})
            }else{
                res.json({isUpdated:false})
            }
            
        }
    )

    
})

// Delete
router.delete("/:id", restriction_0, (req, res, next) => {

    let  {id} = req.params

    CompanyManager.findOneAndDelete(
        {_id: id},
        (err, c_manager) =>{
            if(!err){
                let Operator = require("../../../model/OperatorModel"),
                    Entity = require("../../../model/EntityOfInterestModel");
                
                // cascading delete operators and entities
                c_manager.operators.forEach((operator)=>{
                    Operator.findOneAndDelete({_id: operator._id}, (err, op) =>{
                    })
                })
                c_manager.entities.forEach((entity)=>{
                    Entity.findOneAndDelete({_id: entity._id}, (err, ent) => {
                    })
                })

                res.json({isDeleted: true})
            }else{
                res.json({isDeleted: false})
            }
            
        }
    )
    
})

/**
 * SELF CRUD
 */

// Get Self
router.get("/self/:id", restriction_1A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        CompanyManager.findById(id, (err, c_manager) => {
            if(c_manager){
                res.json(c_manager)
            }
        })
    }else{console.log(req.params, id);
    }
    
})

// Update Self
router.put("/self/:id", restriction_1A, (req, res, next) => {
    let {update} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(update)     

    CompanyManager.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, c_manager) =>{
            if(!err){
                res.json({isUpdated:true})
            }else{
                res.json({isUpdated:false})
            }
            
        }
    )
    
})


  

module.exports = router