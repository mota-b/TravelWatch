let router = require('express').Router(),
    
    Operator = require("../../../model/OperatorModel"),
    CompanyManager = require("../../../model/CompanyManagerModel"),
    {restriction_0_1A, restriction_2A} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0_1A, (req, res, next) => {
    
    // Get the json Item
    let newItem = JSON.parse(req.body.newItem);
    
    // Check if the manager exist
    CompanyManager.findById(newItem.c_manager, (err, c_manager) => {
        if (c_manager){
            
            // Create the new Operator
            let newOperator = new Operator({
                username: newItem.username,
                password: Operator.generatePassword(newItem.password),
                c_manager: newItem.c_manager 
            })
            
            // Save the document
            newOperator.save();

            // Bind the new Operator to the manager
            c_manager.operators.push(newOperator._id)
            c_manager.save()

            res.json({isCreated : true, _id: newOperator._id})
        }else{
            res.json({isCreated : false})
        }



    })  

})

// Read List
router.get("/", restriction_0_1A, (req, res, next) => {
    
    // Return Collection list
    Operator.find({}, (err, operators) => {
        if (operators){
            let data = [];
            operators.forEach( (operator) => {
                data.push({
                    _id: operator._id,
                    username: operator.username,
                    c_manager: operator.c_manager
                    // TODO => populate entities
                })
            });

            // Table display Schema
            let operator_schema = [
                "_id",
                "username", 
                "c_manager"
            ],
            // New Item Create Schema
            new_item_schema = {
                username: "", 
                password: "",
                c_manager: ""
            }

            res.json({collection: data, schema: operator_schema, new_item_schema: new_item_schema})
        }
    })
})


// Read One
router.get("/:id", restriction_0_1A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Operator.findById(id, (err, operator) => {
            if(operator){
                res.json(operator)
            }
        })
    }else{console.log(req.params, id);
    }
    
})
    
// Update
router.put("/:id", restriction_0_1A, (req, res, next) => {
    
    let {update} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(update)     

    Operator.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, operator) =>{
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

    // Remove the operator
    Operator.findOneAndDelete(
        {_id: id},
        (err, operator) =>{
            if(!err){
                // Remove the operator from the c_manager operators list
                CompanyManager.findById(operator.c_manager, (err, c_manager) =>{
                    
                    if(!err && c_manager){
                        let indexRemove = c_manager.operators.indexOf(operator._id)
                        c_manager.operators.splice(indexRemove, 1)
                        c_manager.save()
                    }
                    
                })
                
                res.json({isDeleted:true})
            }else{
                res.json({isDeleted:false})
            }
            
        }
    )
    
})

/**
 * SELF CRUD
 */

// Get Self
router.get("/self/:id", restriction_2A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Operator.findById(id, (err, operator) => {
            if(operator){
                res.json(operator)
            }
        })
    }else{console.log(req.params, id);
    }
    
})



  

module.exports = router