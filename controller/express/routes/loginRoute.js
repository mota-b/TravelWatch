let router = require('express').Router(),
    {links, scripts} = require("../plugins/PagesManager").style_and_scripts("login");

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('loginViews/loginView', { 
    title: 'Login', 
    links: links,
    scripts: scripts
  });

});

/* GET email confirmation page. */
router.get("/confirmation", (req, res, next) => {
  res.render('controleViews/emailConfirmationView', { 
    title: 'Login', 
    links: links,
    scripts: scripts
  });
})

module.exports = router;
