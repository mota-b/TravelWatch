let router = require('express').Router(),
  pagesManager = require("../plugins/PagesManager"), 
  {links, scripts} = pagesManager.style_and_scripts("admin");


/* Get admin */
router.get('/', function(req, res, next){
  res.render('adminViews/adminView', { 
    title: 'Admin', 
    links: links,
    scripts: scripts
  });
})


module.exports = router;
