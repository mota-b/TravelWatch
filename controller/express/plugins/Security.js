/**
 * Module dependencies.
 */
let helmet = require('helmet'),
    csrf = require('csurf');

module.exports = function(app){
    
    app.use(helmet());
    // app.use(csrf());
    // app.use(function(req, res, next){
    //     res.locals.csrftoken = req.csrfToken();
    //     next();
    // });

    /**
     * CORS
     */
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}