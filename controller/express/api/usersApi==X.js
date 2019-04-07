let router = require('express').Router(),
    
    EntityManager = require("../../../model/EntityManagerModel"),
    restriction = require("./apiRestriction")

// Create
router.post("/", (req, res, next) => {

})

// Read List
router.get("/", restriction, (req, res, next) => {
    // Return Users list
    EntityManager.find({}, (err, users) => {
        if (users){
            let data = [];
            users.forEach( (user) => {
                data.push({
                    _id: user._id,
                    username: user.username,
                    email: user.email
                })
            });

            let user_schema = [
                "_id",
                "username", 
                "email"
            ]

            res.json({collection: data, schema: user_schema})
        }
    })
})


// Read One
router.get("/:id", restriction, (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        EntityManager.findById(id, (err, user) => {
            if(user){
                res.json(user)
            }
        })
    }else{console.log(req.params, id);
    }
    
})
    
// Update
router.put("/:id", restriction, (req, res, next) => {
    
    let {user_updated} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(user_updated)     

    EntityManager.findOneAndUpdate(
        {_id: id},
        {$set:update_options},
        (err, user) =>{
            if(!err){
                res.json({isUpdated:true})
            }else{
                res.json({isUpdated:false})
            }
            
        }
    )

    
})

// Delete
router.delete("/:id", restriction, (req, res, next) => {
    console.log("hnaya delete")

    let  {id} = req.params

    EntityManager.findOneAndDelete(
        {_id: id},
        (err, user) =>{
            if(!err){
                res.json({isDeleted:true})
            }else{
                res.json({isDeleted:false})
            }
            
        }
    )
    
})
  

module.exports = router