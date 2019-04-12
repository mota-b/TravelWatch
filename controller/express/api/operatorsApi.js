let router = require('express').Router(),
    
    Operator = require("../../../model/OperatorModel"),
    {restriction_0_1A, restriction_2A} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0_1A, (req, res, next) => {
    res.json({error : {message: "not activated yet"}})
})

// Read List
router.get("/", restriction_0_1A, (req, res, next) => {
    // Return Users list
    
    Operator.find({}, (err, operators) => {
        if (operators){
            let data = [];
            operators.forEach( (operator) => {
                data.push({
                    _id: user._id,
                    username: operator.username,
                    email: operator.email,
                    c_manager: operator.c_manager
                    // TODO => populate entities
                })
            });

            let operator_schema = [
                "_id",
                "username", 
                "email",
                "c_manager"
            ]

            res.json({collection: data, schema: operator_schema})
        }
    })
})


// Read One
router.get("/:id", restriction_0_1A, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Operator.findById(id, (err, operator) => {
            if(user){
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

    Operator.findOneAndDelete(
        {_id: id},
        (err, operator) =>{
            if(!err){
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
            if(user){
                res.json(operator)
            }
        })
    }else{console.log(req.params, id);
    }
    
})



  

module.exports = router