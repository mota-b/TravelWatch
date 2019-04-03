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

     
    // Inegrating the admin-local Strategy ==> call it with : passport.authenticate('admin')
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

    // Inegrating the local Strategy ==> call it with : passport.authenticate('local')
    passport.use(new LocalStrategy( 
        {
            username: "username",
            password: "password"
        },
        (username, password, done) => {

            EntityManager = require("../../../model/EntityManagerModel")
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
            EntityManager.findOne({ $or: [{ email: filter.email}, { username: filter.username}]},  (err, user) => {     
                // Verify if the user is found && the password
                console.log(user);
                
                if(user && user.verifyPassword(password, user.password)){
                    
                    let result = {
                        ui_data: {
                            username: user.username,
                            email : user.email,
                            _id: user._id,
                            isAdmin: user.isAdmin
                        },
                        token : EntityManager.generateJWT(user._id)
                    }
                    done(false, result, null )
                }else{
                    done(err, null, {message:"Incorret username or password"})
                }
            })
        } 
    ))

    // Inegrating the jwt Strategy ==> call it with : passport.authenticate('jwt')
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

    passport.use('api-jwt',new JwtStrategy( 
        {
            jwtFromRequest: ExtractJwt.fromHeader("token"),
            secretOrKey: process.env.API_TOKEN_SECRET
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