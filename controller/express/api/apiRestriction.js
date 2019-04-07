let passport = require("passport")



// Admin Restriction level
let restriction_0 = (req, res, next) => {  
    console.log(req.query);
    
    passport.authenticate( 'admin-jwt', (err, data, info) => {
        // This is the result authentication callback
        //console.log(data);
        
        //Verify if The authentification has succeded
        if(data){
            // valid token go to next middleware
            next()
            //res.json(data)
        }else{
            // invalid token
            console.log(data);
                
            res.json({error : {message: info.message}})
        }
    })(req, res, next)    

},

// CompanyManager Restriction level
restriction_1A = (req, res, next) => {  
    console.log(req.query);
    
    // let {strat_number} = req.query,
    //     strategies = ['admin-jwt', 'api-jwt']
    // if (strategies[strat_number]) {
        passport.authenticate( "company-jwt", (err, data, info) => {
            // This is the result authentication callback
            //console.log(data);
            
            //Verify if The authentification has succeded
            if(data){
                // valid token go to next middleware
                next()
                //res.json(data)
            }else{
                // invalid token 
                console.log(data);
                
                res.json({error : {message: info.message}})
            }
        })(req, res, next)    
    // }else{
    //     res.json({error : {message: "not a valid token strategie"}})
    // }
    
},

// Operator Restriction level
restriction_2A = (req, res, next) => {  
    console.log(req.query);
    
    // let {strat_number} = req.query,
    //     strategies = ['admin-jwt', 'api-jwt']
    // if (strategies[strat_number]) {
        passport.authenticate( "operator-jwt", (err, data, info) => {
            // This is the result authentication callback
            //console.log(data);
            
            //Verify if The authentification has succeded
            if(data){
                // valid token go to next middleware
                next()
                //res.json(data)
            }else{
                // invalid token 
                console.log(data);
                
                res.json({error : {message: info.message}})
            }
        })(req, res, next)    
    // }else{
    //     res.json({error : {message: "not a valid token strategie"}})
    // }
    
},

// Mate Restriction level
restriction_1B = (req, res, next) => {  
    console.log(req.query);
    
    // let {strat_number} = req.query,
    //     strategies = ['admin-jwt', 'api-jwt']
    // if (strategies[strat_number]) {
        passport.authenticate( "mate-jwt", (err, data, info) => {
            // This is the result authentication callback
            //console.log(data);
            
            //Verify if The authentification has succeded
            if(data){
                // valid token go to next middleware
                next()
                //res.json(data)
            }else{
                // invalid token 
                console.log(data);
                
                res.json({error : {message: info.message}})
            }
        })(req, res, next)    
    // }else{
    //     res.json({error : {message: "not a valid token strategie"}})
    // }
    
},

// Admin & CompanyManager Restriction level
restriction_0_1A = (req, res, next) => {  
    console.log(req.query);
    
    // let {strat_number} = req.query,
    //     strategies = ['admin-jwt', 'api-jwt']
    // if (strategies[strat_number]) {
        passport.authenticate( "company-jwt", (err, data, info) => {
            // This is the result authentication callback
            //console.log(data);
            
            //Verify if The authentification has succeded
            if(data){
                // valid token go to next middleware
                next()
                //res.json(data)
            }else{
                // invalid token 
                console.log(data);
                
                // try uper restriction lvl
                restriction_0(req, res, next)   
                
                // res.json({error : {message: info.message}})
            }
        })(req, res, next)    
    // }else{
    //     res.json({error : {message: "not a valid token strategie"}})
    // }
    
},

// Admin & Mate Restriction level
restriction_0_1B = (req, res, next) => {  
    console.log(req.query);
    
    // let {strat_number} = req.query,
    //     strategies = ['admin-jwt', 'api-jwt']
    // if (strategies[strat_number]) {
        passport.authenticate( strategies[strat_number], (err, data, info) => {
            // This is the result authentication callback
            //console.log(data);
            
            //Verify if The authentification has succeded
            if(data){
                // valid token go to next middleware
                next()
                //res.json(data)
            }else{
                // invalid token
                console.log(data);
                 
                // try uper restriction lvl
                restriction_0(req, res, next)   

                res.json({error : {message: info.message}})
            }
        })(req, res, next)    
    // }else{
    //     res.json({error : {message: "not a valid token strategie"}})
    // }
    
},

// Admin, Mate Restriction level
restriction_0_1A_2A = (req, res, next) => {  
    console.log(req.query);
    
    // let {strat_number} = req.query,
    //     strategies = ['admin-jwt', 'api-jwt']
    // if (strategies[strat_number]) {
        passport.authenticate( strategies[strat_number], (err, data, info) => {
            // This is the result authentication callback
            //console.log(data);
            
            //Verify if The authentification has succeded
            if(data){
                // valid token go to next middleware
                next()
                //res.json(data)
            }else{
                // invalid token
                console.log(data);
                    
                // try uper restriction lvl
                restriction_0_1A(req, res, next)   

                res.json({error : {message: info.message}})
            }
        })(req, res, next)    
    // }else{
    //     res.json({error : {message: "not a valid token strategie"}})
    // }
    
};



module.exports = {
    restriction_0,
    restriction_1A,
    restriction_2A,
    restriction_1B,
    restriction_0_1A, 
    restriction_0_1B, 
    restriction_0_1A_2A
}