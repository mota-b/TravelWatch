let router = require('express').Router(),
    {links, scripts} = require("../plugins/PagesManager").style_and_scripts("user");

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('userViews/userView', { 
    title: 'Login', 
    links: links,
    scripts: scripts
  });

});


module.exports = router;
