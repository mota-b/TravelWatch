let router = require('express').Router(),
    passport = require("passport")
    User = require("../../../model/userModel")


// Create
router.post("/", (req, res, next) => {

})

// Read List
router.get("/", passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // Return Users list
    User.find({}, (err, users) => {
        if (users){
            let data = [];
            users.forEach( (user) => {
                data.push({
                    _id: user._id,
                    username: user.username,
                    email: user.email, 
                    isAdmin: user.isAdmin   
                })
            });

            res.json(data)
        }
    })
})

// Read One
router.get("/:id",passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let id = req.params['id']
    if(req.params && id){
        User.findById(id, (err, user) => {
            if(user){
                res.json(user)
            }
        })
    }else{console.log(req.params, id);
    }
    
})
    
// Update
router.put("/:id", passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let {user_updated} = req.body,
        {id} = req.params
   
    let update_options = JSON.parse(user_updated)     

    console.log(update_options);
    
    User.findOneAndUpdate(
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
router.delete("/", passport.authenticate('jwt', {session:false}), (req, res, next) => {

})
  

module.exports = router