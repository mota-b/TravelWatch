let router = require('express').Router(),
    pagesManager = require("../plugins/PagesManager")("user");

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('userViews/userView', { 
    title: 'Login', 
    links: pagesManager.links,
    scripts: pagesManager.scripts
  });

});


module.exports = router;
