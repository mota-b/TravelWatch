let router = require('express').Router(),
    pagesManager = require("../plugins/PagesManager")("login");

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('loginViews/loginView', { 
    title: 'Login', 
    links: pagesManager.links,
    scripts: pagesManager.scripts
  });

});

/* GET email confirmation page. */
router.get("/confirmation", (req, res, next) => {
  res.render('controleViews/emailConfirmationView', { 
    title: 'Login', 
    links: pagesManager.links,
    scripts: pagesManager.scripts
  });
})

module.exports = router;
