// Requires
let mongoose = require("mongoose"),
    jwt = require("jsonwebtoken"), 
    bcrypt = require("bcrypt"),
    Schema = mongoose.Schema;

// The schema
let AdminSchema = new Schema({
    email: {type: String, require: true, unique: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true}
}) 

/**
 * Admin methodes
 */ 

// Cyphering a password
AdminSchema.statics.generatePassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// Verify a password
AdminSchema.methods.verifyPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
  
// Generate a token
AdminSchema.statics.generateJWT = (data, options) => {
    
    if (options){
        return jwt.sign(
            {
                _id: data
            },
            process.env.ADMIN_SECRET,
            options
        );
    }else{
        return jwt.sign(
            {
                _id: data
            },
            process.env.ADMIN_SECRET,
            { expiresIn: "1d" }
        );
    }
    
}

// Verify the token
AdminSchema.statics.verifyJWT = (token) => {
    return jwt.verify(token, process.env.ADMIN_SECRET,{})   
}

// The model
var Admin = mongoose.model('admin', AdminSchema);


// Fast create element
let fastElem = () => {
    newElem = new User({
        username: "Admin0",
        email: "a@g.com",
        password : Admin.generatePassword("0000")
    })
    
    newElem.save((err, admin) => {
        if(admin){
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
module.exports = Admin;