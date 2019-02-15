
/**
 * Module dependencies.
 */
//var appController = require("../controller/appController");

module.exports = function(app){
  
    // Catch 404 and forward to Error
    app.use(function(req, res, next) {
        let error = new Error('Not Found');
        error.status = 404 
        res.render('controleViews/errorView', {
            title: "Error",
            links: [
                "https://use.fontawesome.com/releases/v5.7.0/css/all.css", // Font Awesome
                "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/css/bootstrap.min.css", // Bootstrap Core
                "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.1/css/mdb.min.css", // Material Design Bootstrap 
                "/css/indexStyle.css" // Custom css of the route
            ],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js", // jQuery
                "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js", // Bootstrap tooltips
                "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/js/bootstrap.min.js", // Bootstrap Core
                "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.1/js/mdb.min.js", // Material Design Bootstrap JS 
                "/js/indexScript.js" // Custom javascripts of the route
            ],
            error: error
        })
    });
  
}