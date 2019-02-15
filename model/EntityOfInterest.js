// Requires
let mongoose = require("mongoose"),
    jwt = require("jsonwebtoken"), 
    bcrypt = require("bcrypt"),
    Schema = mongoose.Schema;

// The schema
let TrackSchema = new Schema({
    track_name: String,
    entity_ids: []
}) 

/**
 * User methodes
 */ 

// Cyphering a password
UserSchema.statics.generatePassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// Verify a password
UserSchema.methods.verifyPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
  
// Generate a token
UserSchema.statics.generateJWT = (data, options) => {
    
    if (options){
        return jwt.sign(
            {
                _id: data
            },
            process.env.TOKEN_SECRET,
            options
        );
    }else{
        return jwt.sign(
            {
                _id: data
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );
    }
    
    
}
UserSchema.statics.generateEmailJWT = (data, options) => {
    
    if (options){
        return jwt.sign(
            {
                tokenUser: data
            },
            process.env.TOKEN_SECRET,
            options
        );
    }else{
        return jwt.sign(
            {
                tokenUser: data
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );
    }
    
    
}

// Verify the token
UserSchema.statics.verifyJWT = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET,{})   
}

// The model
var User = mongoose.model('user', UserSchema);


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
module.exports = User