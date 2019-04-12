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
                            username: c_manager.username,
                            email : c_manager.email,
                            _id: c_manager._id,
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

    // Inegrating the 'local' (operator) logIn Strategy ==> call it with : passport.authenticate('operator')
    passport.use('operator', new LocalStrategy( 
        {
            username: "username",
            password: "password"
        },
        (username, password, done) => {

            Operator = require("../../../model/Operator")
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
            Operator.findOne({ $or: [{ email: filter.email}, { username: filter.username}]},  (err, operator) => {     
                // Verify if the user is found && the password
                if(operator && operator.verifyPassword(password, operator.password)){
                    
                    let result = {
                        ui_data: {
                            username: operator.username,
                            email : operator.email,
                            _id: operator._id,
                        },
                        token : Operator.generateJWT(operator._id)
                    }
                    done(false, result, null )
                }else{
                    done(err, null, {message:"Incorret username or password"})
                }
            })
        } 
    ))

    // Inegrating the 'local' (mate) logIn Strategy ==> call it with : passport.authenticate('mate')
    passport.use('mate', new LocalStrategy( 
        {
            username: "username",
            password: "password"
        },
        (username, password, done) => {

            Mate = require("../../../model/MateModel")
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
            Mate.findOne({ $or: [{ email: filter.email}, { username: filter.username}]},  (err, mate) => {     
                // Verify if the user is found && the password
                console.log(mate);
                
                if(mate && mate.verifyPassword(password, mate.password)){
                    
                    let result = {
                        ui_data: {
                            username: mate.username,
                            email : mate.email,
                            _id: mate._id,
                        },
                        token : Mate.generateJWT(mate._id)
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
            console.log("This is The JWT strategy of admin");
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
    passport.use('c_manager-jwt',new JwtStrategy( 
        {
            jwtFromRequest: ExtractJwt.fromHeader("token"),
            secretOrKey: process.env.COMPANY_MANAGER_TOKEN_SECRET
        },
        (decode, done) => {
            console.log("This is The JWT strategy of Company Manager");
            if(decode){
                // True token
                done(false, decode, null);
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
            console.log("This is The JWT strategy of mate");
            if(decode){
                // True token
                done(false, decode, null);
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
            console.log("This is The JWT strategy of operator");
            if(decode){
                // True token
                done(false, decode, null);
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