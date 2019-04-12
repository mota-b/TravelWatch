let router = require('express').Router(),
    {links, scripts} = require("../plugins/PagesManager").style_and_scripts("company");

/* GET login page. */
router.get('/manage', function(req, res, next) {
  res.render('companyViews/company_manageView', { 
    title: 'manage', 
    links: links,
    scripts: scripts
  });

});


module.exports = router;
