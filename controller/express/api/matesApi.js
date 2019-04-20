let router = require('express').Router(),
    
    Mate = require("../../../model/MateModel"),
    {restriction_0, restriction_1B} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0, (req, res, next) => {
    res.json({error : {message: "not activated yet"}})
})

// Read List
router.get("/", restriction_0, (req, res, next) => {
    // Return mates list
    Mate.find({}, (err, mates) => {
        if (mates){
            let data = [];
            mates.forEach( (mate) => {
                data.push({
                    _id: mate._id,
                    username: mate.username,
                    email: mate.email,
                    image: mate.image
                })
            });

            let mate_schema = [
                "_id",
                "username", 
                "email"
            ],
            new_item_schema = {
        
                username: "",
                email: "",
                image: ""
            }

            res.json({collection: data, schema: mate_schema, new_item_schema: new_item_schema})
        }
    })
})


// Read One
router.get("/:id", restriction_0, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        Mate.findById(id, (err, mate) => {
            if(mate){
                res.json(mate)
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

    Mate.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, mate) =>{
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

    Mate.findOneAndDelete(
        {_id: id},
        (err, mate) =>{
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
router.get("/self/:id", restriction_1B, (req, res, next) => {
    
    let id = req.params['id']
    if(req.params && id){
        Mate.findById(id, (err, mate) => {
            if(mate){
                res.json(mate)
            }
        })
    }else{console.log(req.params, id);
    }
    
})

// Update Self
router.put("/self/:id", restriction_1B, (req, res, next) => {
    let {update} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(update)     

    Mate.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, mate) =>{
            if(!err){
                res.json({isUpdated:true})
            }else{
                res.json({isUpdated:false})
            }
            
        }
    )
    
})


  

module.exports = router