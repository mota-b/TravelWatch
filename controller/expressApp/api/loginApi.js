let router = require('express').Router(),
    passport = require("passport"),
    nodemailer = require("nodemailer"),
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "kaizen.org.dz@gmail.com", pass: "kaizen.org24" }
    }),
    CompanyManager = require("../../../model/CompanyManagerModel"),
    Mate = require("../../../model/MateModel");
    


/* Authentication calls methodes */
let authenticate_mate = (req, res, next) => {
    let {strategie, remember} = req.body
    
        passport.authenticate( "mate", (err, data, info) => {
            // This is the result authentication callback
            
            
            //Verify if The authentification has succeded
            if(data){
                data.remember = remember
                res.json(data)
            }else{


                res.json({error : info})
            }
        })(req, res, next)    
    },
    authenticate_company = (req, res, next) => {
        let {strategie, remember} = req.body
        
        passport.authenticate( "c_manager", (err, data, info) => {
            // This is the result authentication callback
            
            
            
            //Verify if The authentification has succeded
            if(data){
                console.log("i am c_manager");
                data.remember = remember
                res.json(data)
            }else{
                console.log("Try operator");
                authenticate_operator(req, res, next)
            }
        })(req, res, next)    
    },
    authenticate_operator = (req, res, next) => {
        let {strategie, remember} = req.body
        
        
        passport.authenticate( "operator", (err, data, info) => {
            // This is the result authentication callback
            
            
            
            //Verify if The authentification has succeded
            if(data){
                console.log("i am operator");
                data.remember = remember
                res.json(data)
            }else{
                console.log("Try mate");
                authenticate_mate(req, res, next)
            }
        })(req, res, next)    
    },
    authenticate_admin = (req, res, next) => {
        let {strategie, remember} = req.body
        passport.authenticate( 'admin', (err, data, info) => {
            // This is the result authentication callback
            
            
            //Verify if The authentification has succeded
            if(data){
                data.remember = remember
                res.json(data)
            }else{
                res.json({error : info})
            }
        })(req, res, next)  
    }
/* local Methodes*/
let isEmpty = (list) => {
    let v = false;
    list.forEach(element => {
        
        if(element == undefined || element == ''){
            
            
            v = true
        }
    });

    return v
}

// Register Company
router.post("/reg/company", (req, res, next) => {  
    let {username, email, password, company_name} = req.body;
    
    
    if(!isEmpty([username, email, password, company_name])){
        // Verify if someon registered with the same email or username
        CompanyManager.findOne({ $or: [{ email: email}, { username: username}, { company_name: company_name}]}, (err, company) => {

            // the email or username exist in the DB
            if (company) {
                res.json({ error: {message: "email or username already used" } });
            }// the email and username does not exist in the DB
             else {
                  
                var hash = CompanyManager.generatePassword(password)
                // no error while crypting the pass word
                if (hash) {
                    
                    // Create a user object with comming data
                    var newCompany = {
                        email: email,
                        username: username,
                        password: hash,
                        company_name: company_name,
                        company_location: {lat:"", lon:""},
                    };
    
                    /**
                     * building & sending the confirmation email 
                     */
    
                    // building the token
                    var token = CompanyManager.generateJWT(
                         newCompany,
                        { expiresIn: "20m" }
                    );
                    
    
                    // building the email with the confirmation link nested with token
                    var url = process.env.SITE_URL + "/api/login/confirmation/company/" + token;
                    var emailCompany = newCompany.email;
                    var mailOptions = {
                        from: "kaizen.org.dz@gmail.com",
                        to: emailCompany,
                        subject: "Account Verification Token",
                        text:
                            "\nHello,\n\n" +
                            "Please activate your account by clicking this link : \n\n " +
                            url 
    
                            
                    };
    
                    // Sending the email of confirmation to activate the user acount
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log(
                                "fail to send mail :" + err.message
                            );
                            // res.status(500).json({
                            //     message:
                            //         "fail to send mail :" +
                            //         err.message
                            // });
                        }
                        else{
                            // res.json({error : {message: "error sending confirmation email"}})
                        
                            res.json({redirect:"/login/confirmation"})
                        }

                    });
    
                    
    
                }
                // cypher error ocured 
                else {
                    console.log(err);
                    res.json({error:{message:"acount ceration error try later"}})
                }   
            }
        });
         
    }else {
        console.log({username, email, password, company_name});
        
        res.json({ error: {message: "Not expected inputs" } });
    }
    // else{
    //     // Verify if someon registered with the same email or username
    //     Mate.findOne({ $or: [{ email: email}, { username: username}, { company_name: company_name}]}, (err, user) => {

    //         // the email or username exist in the DB
    //         if (user) {
    //             res.json({ error: {message: "email or username already used" } });
    //         }// the email and username does not exist in the DB
    //          else {
                  
    //             var hash = EntityManager.generatePassword(password)
    //             // no error while crypting the pass word
    //             if (hash) {
                    
    //                 // Create a user object with comming data
    //                 var newUser = {
    //                     email: email,
    //                     username: username,
    //                     password: hash,
    //                 };
    
    //                 /**
    //                  * building & sending the confirmation email 
    //                  */
    
    //                 // building the token
    //                 var token = EntityManager.generateJWT(
    //                      newUser,
    //                     { expiresIn: "20m" }
    //                 );
                    
    
    //                 // building the email with the confirmation link nested with token
    //                 var url = process.env.SITE_URL + "/api/login/confirmation/" + token;
    //                 var emailUser = newUser.email;
    //                 var mailOptions = {
    //                     from: "kaizen.org.dz@gmail.com",
    //                     to: emailUser,
    //                     subject: "Account Verification Token",
    //                     text:
    //                         "\nHello,\n\n" +
    //                         "Please activate your account by clicking this link : \n\n " +
    //                         url 
    
                            
    //                 };
    
    //                 // Sending the email of confirmation to activate the user acount
    //                 transporter.sendMail(mailOptions, function (err) {
    //                     if (err) {
    //                         console.log(
    //                             "fail to send mail :" + err.message
    //                         );
    //                         res.status(500).json({
    //                             message:
    //                                 "fail to send mail :" +
    //                                 err.message
    //                         });
    //                     }
    //                     else{
    //                         res.json({error : {message: "error sending confirmation email"}})
    //                     }
    //                 });
    
    //                 res.json({redirect:"/login/confirmation"})
    
    //             }
    //             // cypher error ocured 
    //             else {
    //                 console.log(err);
    //                 res.json({error:{message:"acount ceration error try later"}})
    //             }   
    //         }
    //     });
        
    // }
    

    
    
})

// Register Mate
router.post("/reg/mate", (req, res, next) => {  
    let {username, email, password} = req.body;

    
    if(!isEmpty([username, email, password])){
        // Verify if someon registered with the same email or username
        Mate.findOne({ $or: [{ email: email}, { username: username}]}, (err, mate) => {

            // the email or username exist in the DB
            if (mate) {
                res.json({ error: {message: "email or username already used" } });
            }// the email and username does not exist in the DB
             else {
                  
                var hash = Mate.generatePassword(password)
                // no error while crypting the pass word
                if (hash) {
                    
                    // Create a user object with comming data
                    var newMate = {
                        email: email,
                        username: username,
                        password: hash,
                        image: ""
                    };
    
                    /**
                     * building & sending the confirmation email 
                     */
    
                    // building the token
                    var token = Mate.generateJWT(
                         newMate,
                        { expiresIn: "20m" }
                    );
                    
    
                    // building the email with the confirmation link nested with token
                    var url = process.env.SITE_URL + "/api/login/confirmation/mate/" + token;
                    var emailMate = newMate.email;
                    var mailOptions = {
                        from: "kaizen.org.dz@gmail.com",
                        to: emailMate,
                        subject: "Account Verification Token",
                        text:
                            "\nHello,\n\n" +
                            "Please activate your account by clicking this link : \n\n " +
                            url 
    
                            
                    };
    
                    // Sending the email of confirmation to activate the user acount
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log(
                                "fail to send mail :" + err.message
                            );
                            res.status(500).json({
                                message:
                                    "fail to send mail :" +
                                    err.message
                            });
                        }
                        else{
                            res.json({error : {message: "error sending confirmation email"}})
                        }
                    });
    
                    res.json({redirect:"/login/confirmation"})
    
                }
                // cypher error ocured 
                else {
                    console.log(err);
                    res.json({error:{message:"acount ceration error try later"}})
                }   
            }
        });
         
    }else {
        res.json({ error: {message: "Not expected inputs" } });
    }
    // else{
    //     // Verify if someon registered with the same email or username
    //     Mate.findOne({ $or: [{ email: email}, { username: username}, { company_name: company_name}]}, (err, user) => {

    //         // the email or username exist in the DB
    //         if (user) {
    //             res.json({ error: {message: "email or username already used" } });
    //         }// the email and username does not exist in the DB
    //          else {
                  
    //             var hash = EntityManager.generatePassword(password)
    //             // no error while crypting the pass word
    //             if (hash) {
                    
    //                 // Create a user object with comming data
    //                 var newUser = {
    //                     email: email,
    //                     username: username,
    //                     password: hash,
    //                 };
    
    //                 /**
    //                  * building & sending the confirmation email 
    //                  */
    
    //                 // building the token
    //                 var token = EntityManager.generateJWT(
    //                      newUser,
    //                     { expiresIn: "20m" }
    //                 );
                    
    
    //                 // building the email with the confirmation link nested with token
    //                 var url = process.env.SITE_URL + "/api/login/confirmation/" + token;
    //                 var emailUser = newUser.email;
    //                 var mailOptions = {
    //                     from: "kaizen.org.dz@gmail.com",
    //                     to: emailUser,
    //                     subject: "Account Verification Token",
    //                     text:
    //                         "\nHello,\n\n" +
    //                         "Please activate your account by clicking this link : \n\n " +
    //                         url 
    
                            
    //                 };
    
    //                 // Sending the email of confirmation to activate the user acount
    //                 transporter.sendMail(mailOptions, function (err) {
    //                     if (err) {
    //                         console.log(
    //                             "fail to send mail :" + err.message
    //                         );
    //                         res.status(500).json({
    //                             message:
    //                                 "fail to send mail :" +
    //                                 err.message
    //                         });
    //                     }
    //                     else{
    //                         res.json({error : {message: "error sending confirmation email"}})
    //                     }
    //                 });
    
    //                 res.json({redirect:"/login/confirmation"})
    
    //             }
    //             // cypher error ocured 
    //             else {
    //                 console.log(err);
    //                 res.json({error:{message:"acount ceration error try later"}})
    //             }   
    //         }
    //     });
        
    // }
    

    
    
})

// Confirmation company
router.get("/confirmation/company/:token", (req, res, next) => {  

    //let {username, email, password} = req.body
    let {token} = req.params,
        decode = CompanyManager.verifyJWT(token);
    
    if(decode){
        
        let tokenCompany = decode._id;
        newCompany = new CompanyManager({
            email: tokenCompany.email,
            username: tokenCompany.username,
            password: tokenCompany.password,
            company_name: tokenCompany.company_name,
            company_location: tokenCompany.company_location
        })
        newCompany.save()

        res.send(
            "<script> window.close();</script>"
        )
    }
    
    // passport.authenticate( strategies[strat_number], (err, data, info) => {
    //     // This is the result authentication callback
        
        
    //     //Verify if The authentification has succeded
    //     if(data){
    //         //console.log(data);
            
    //         res.json(data)
    //     }else{
    //         res.json({error : info})
    //     }
    // })(req, res, next)
   
})

// Confirmation mate
router.get("/confirmation/mate/:token", (req, res, next) => {  

    //let {username, email, password} = req.body
    let {token} = req.params,
        decode = Mate.verifyJWT(token);
    
    if(decode){
        
        let tokenMate = decode._id;
        newMate = new Mate({
            email: tokenMate.email,
            username: tokenMate.username,
            password: tokenMate.password,
            image: tokenMate.image
        })
        newMate.save()

        res.send(
            "<script> window.close();</script>"
        )
    }
    
    // passport.authenticate( strategies[strat_number], (err, data, info) => {
    //     // This is the result authentication callback
        
        
    //     //Verify if The authentification has succeded
    //     if(data){
    //         //console.log(data);
            
    //         res.json(data)
    //     }else{
    //         res.json({error : info})
    //     }
    // })(req, res, next)
   
})

// Login
router.post("/log", function(req, res, next){  
    //console.log(req.body);
    
    
       
        
    //if (strategie) {

    // try authenticate as company_manager
        authenticate_company(req, res, next)
    //}else{
    //    res.json({error : {message: "not a valid strategie"}})
    //}
})

// Login {Admin}
router.post("/log/admin", function(req, res, next){  
    
    
    //if (strategies[strat_number]) {
       authenticate_admin(req, res, next)
    // }else{
    //     res.json({error : {message: "not a valid strategie"}})
    // }
})

    
module.exports = router
  