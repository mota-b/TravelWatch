// Requires
let mongoose = require("mongoose"),
    jwt = require("jsonwebtoken"), 
    bcrypt = require("bcrypt"),
    Schema = mongoose.Schema;

// The schema
let CompanyManagerSchema = new Schema({

    email: {type: String, require: true, unique: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    
    company_name: {type: String, require: true, unique: true},
    company_location: {
        lat: String,
        lon: String
    },
    isCompanyUnlocked: {type: Boolean, default: false},
    
    operators: Array, 
    Entities: Array 
}) 

/**
 * CompanyManager methodes
 */ 

// Cyphering a password
CompanyManagerSchema.statics.generatePassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// Verify a password
CompanyManagerSchema.methods.verifyPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
  
// Generate a token
CompanyManagerSchema.statics.generateJWT = (data, options) => {
    
    if (options){
        return jwt.sign(
            {
                _id: data
            },
            process.env.COMPANY_TOKEN_SECRET,
            options
        );
    }else{
        return jwt.sign(
            {
                _id: data
            },
            process.env.COMPANY_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
    }
    
    
}

// Verify the token
CompanyManagerSchema.statics.verifyJWT = (token) => {
    return jwt.verify(token, process.env.COMPANY_TOKEN_SECRET,{})   
}

// The model
var CompanyManager = mongoose.model('companyManager', CompanyManagerSchema);


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
module.exports = CompanyManager