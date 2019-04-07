/**
 * Module dependencies.
 */
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    JwtStrategy = require('passport-jwt').Strategy,
    { ExtractJwt } = require('passport-jwt')


module.exports = function(app){
    
    
    
    /**
     * Passport Config
     */    
    //app.use(passport.initialize()); // init the passport elements in the Req (as req._passport.instance)
    //app.use(passport.session()); // bind the passport session with express session (only 1 session here)

     
    // Inegrating the 'local' (admin) logIn Strategy ==> call it with : passport.authenticate('admin')
    passport.use('admin', new LocalStrategy( 
        {
            username: "username",
            password: "password"
        },
        (username, password, done) => {

            
            
            let Admin = require("../../../model/AdminModel")
            //console.log("This is The 'admin' local strategy");
            
           
            // Find a matching user to logIn            
            Admin.findOne({ username: username},  (err, admin) => {     
                // Verify if the user is found && the password
            
                
                if(admin && admin.verifyPassword(password, admin.password)){
                    
                    let result = {
                        ui_data: {
                            username: admin.username,
                        },
                        token : Admin.generateJWT(admin._id)
                    }
                    done(false, result, null )
                }else{
                    done(err, null, {message:"Incorret username or password"})
                }
            })
        } 
    ))

    // Inegrating the 'local' (company manager) logIn Strategy ==> call it with : passport.authenticate('c_manager')
    passport.use('c_manager', new LocalStrategy( 
        {
            username: "username",
            password: "password"
        },
        (username, password, done) => {

            CompanyManager = require("../../../model/CompanyManagerModel")
            //console.log("This is The 'local' local strategy");
            
            // Verify if the user logIn with username or email
            let filter = {
                username: null,
                email: null
            }
            let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
            if(username.match(emailRegex)){
                // This is an email
                filter.email = username    
            }else{
                // This is an username
                filter.username = username
            }
            
            // Find a matching user to logIn            
            CompanyManager.findOne({ $or: [{ email: filter.email}, { username: filter.username}]},  (err, c_manager) => {     
                // Verify if the user is found && the password
                console.log(c_manager);
                
                if(c_manager && c_manager.verifyPassword(password, c_manager.password)){
                    
                    let result = {
                        ui_data: {
                            username: user.username,
                            email : user.email,
                            _id: user._id,
                        },
                        token : CompanyManager.generateJWT(c_manager._id)
                    }
                    done(false, result, null )
                }else{
                    done(err, null, {message:"Incorret username or password"})
                }
            })
        } 
    ))

    // Inegrating the 'jwt' (admin) API-TOKEN Strategy ==> call it with : passport.authenticate('admin-jwt')
    passport.use('admin-jwt',new JwtStrategy( 
        {
            jwtFromRequest: ExtractJwt.fromHeader("token"),
            secretOrKey: process.env.ADMIN_TOKEN_SECRET
        },
        (decode, done) => {
            console.log("This is The JWT strategy");
            if(decode){
                // True token
                done(false, decode, null);
                
            }else{
                // True token
                done(false, null, {message: "token invalid or expired"});
            }  
        }
    ))

    // Inegrating the 'jwt' (company) API-TOKEN Strategy ==> call it with : passport.authenticate('company-jwt')
    passport.use('company-jwt',new JwtStrategy( 
        {
            jwtFromRequest: ExtractJwt.fromHeader("token"),
            secretOrKey: process.env.COMPANY_MANAGER_TOKEN_SECRET
        },
        (decode, done) => {
            console.log("This is The JWT strategy");
            if(decode){
                // True token
                done(false, decode);
            }else{
                // True token
                done(false, null, {message: "token invalid or expired"});
            }  
        }
    ))

    // Inegrating the 'jwt' (mate) API-TOKEN Strategy ==> call it with : passport.authenticate('mate-jwt')
    passport.use('mate-jwt',new JwtStrategy( 
        {
            jwtFromRequest: ExtractJwt.fromHeader("token"),
            secretOrKey: process.env.MATE_TOKEN_SECRET
        },
        (decode, done) => {
            console.log("This is The JWT strategy");
            if(decode){
                // True token
                done(false, decode);
            }else{
                // True token
                done(false, null, {message: "token invalid or expired"});
            }  
        }
    ))

    // Inegrating the 'jwt' (operator) API-TOKEN Strategy ==> call it with : passport.authenticate('operator-jwt')
    passport.use('operator-jwt',new JwtStrategy( 
        {
            jwtFromRequest: ExtractJwt.fromHeader("token"),
            secretOrKey: process.env.OPERATOR_TOKEN_SECRET
        },
        (decode, done) => {
            console.log("This is The JWT strategy");
            if(decode){
                // True token
                done(false, decode);
            }else{
                // True token
                done(false, null, {message: "token invalid or expired"});
            }  
        }
    ))

    // Global user to EJS
    // app.use(function(req, res, next){
    //     res.locals.user = req.user 
    //     next();
    // })
}