// Requires
let mongoose = require("mongoose"),
    jwt = require("jsonwebtoken"), 
    bcrypt = require("bcrypt"),
    Schema = mongoose.Schema;

// The schema
let EntityManagerSchema = new Schema({
    email: {type: String, require: true, unique: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    manager_location: String,
    
    track_ids: []
}) 

/**
 * EntityManager methodes
 */ 

// Cyphering a password
EntityManagerSchema.statics.generatePassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// Verify a password
EntityManagerSchema.methods.verifyPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
  
// Generate a token
EntityManagerSchema.statics.generateJWT = (data, options) => {
    
    if (options){
        return jwt.sign(
            {
                _id: data
            },
            process.env.JWT_SECRET,
            options
        );
    }else{
        return jwt.sign(
            {
                _id: data
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
    }
    
    
}

// Verify the token
EntityManagerSchema.statics.verifyJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET,{})   
}

// The model
var EntityManager = mongoose.model('entityManager', EntityManagerSchema);


// Fast create element
let fastElem = () => {
    newElem = new User({
        username: "A",
        email: "a@g.com",
        isAdmin: false,
        password : User.generatePassword("0000")
    })
    
    newElem.save((err, user) => {
        if(user){
            console.log("yes !!");
            console.log(err);
            
        }else{
            console.log("err !!");
            console.log(err);  
        }
    })
}
//fastElem()

//Exporting the model from the schema
module.exports = EntityManager