let router = require('express').Router(),
    pagesManager = require("../plugins/PagesManager")("admin");

/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('adminViews/adminView', { 
    title: 'Admin', 
    links: pagesManager.links,
    scripts: pagesManager.scripts
  });

});

module.exports = router;
