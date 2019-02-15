let router = require('express').Router(),
    passport = require("passport"),
    nodemailer = require("nodemailer"),
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "kaizen.org.dz@gmail.com", pass: "kaizen.org24" }
    });

// Register
router.post("/reg", (req, res, next) => {  

    let {username, email, password} = req.body
    console.log({username, email, password});
    
    // Verify if someon registered with the same email or username
    User.findOne({ $or: [{ email: email}, { username: username}]}, (err, user) => {

        // the email or username exist in the DB
        if (user) {
            res.json({ error: {message: "email or username already used" } });
        }// the email and username does not exist in the DB
         else {
              
            var hash = User.generatePassword(password)
            // no error while crypting the pass word
            if (hash) {
                
                // Create a user object with comming data
                var newUser = {
                    email: email,
                    username: username,
                    password: hash,
                };

                /**
                 * building & sending the confirmation email 
                 */

                // building the token
                var token = User.generateEmailJWT(
                     newUser,
                    { expiresIn: "20m" }
                );
                

                // building the email with the confirmation link nested with token
                var url = process.env.SITE_URL + "/api/login/confirmation/" + token;
                var emailUser = newUser.email;
                var mailOptions = {
                    from: "kaizen.org.dz@gmail.com",
                    to: emailUser,
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
})

// Confirmation
router.get("/confirmation/:token", (req, res, next) => {  

    //let {username, email, password} = req.body
    let {token} = req.params,
        decode = User.verifyJWT(token);

    if(decode){
        console.log(decode.tokenUser);
        
        newUser = new User(decode.tokenUser)
        newUser.save()

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
    
    let {strat_number, remember} = req.body,
        strategies = ['local']
    if (strategies[strat_number]) {
        passport.authenticate( strategies[strat_number], (err, data, info) => {
            // This is the result authentication callback
            
            
            //Verify if The authentification has succeded
            if(data){
                data.remember = remember
                res.json(data)
            }else{
                res.json({error : info})
            }
        })(req, res, next)    
    }else{
        res.json({error : {message: "not a valid strategie"}})
    }
})

    
module.exports = router
  