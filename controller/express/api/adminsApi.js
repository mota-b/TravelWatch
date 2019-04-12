let router = require('express').Router(),
    
    Admin = require("../../../model/AdminModel"),
    {restriction_0} = require("./apiRestriction")


/**
 * Basic CRUD
 */

// Create
router.post("/", restriction_0, (req, res, next) => {
    res.json({error : {message: "not activated yet"}})
})

// Read List
router.get("/", restriction_0, (req, res, next) => {
    res.json({error : {message: "not activated yet"}})
})


// Read One
router.get("/:id", restriction_0, (req, res, next) => {
    res.json({error : {message: "not activated yet"}})
    
})
    
// Update
router.put("/:id", restriction_0, (req, res, next) => {
    
    res.json({error : {message: "not activated yet"}})

    
})

// Delete
router.delete("/:id", restriction_0, (req, res, next) => {

    res.json({error : {message: "not activated yet"}})
    
})


module.exports = router