let passport = require("passport")

module.exports = (req, res, next) => {  
        console.log(req.query);
        
        let {strat_number} = req.query,
            strategies = ['admin-jwt', 'api-jwt']
        if (strategies[strat_number]) {
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
                     
                    res.json({error : {message: info.message}})
                }
            })(req, res, next)    
        }else{
            res.json({error : {message: "not a valid token strategie"}})
        }
        
    }