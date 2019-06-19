let router = require('express').Router()    ;

/* GET Manage page. */
router.get('/manage', function(req, res, next) {
  let {links, scripts} = require("../plugins/PagesManager").style_and_scripts("company");
  res.render('companyViews/company_manageView', { 
    title: 'manage', 
    links: links,
    scripts: scripts
  });
});

/* GET Manage page. */
router.get('/overwatch', function(req, res, next) {
  let {links, scripts} = require("../plugins/PagesManager").style_and_scripts("overwatch")
  res.render('companyViews/company_overwatchView', { 
    title: 'overwatch', 
    links: links,
    scripts: scripts
  });
});

/* GET Profile page. */
router.get('/profile', function(req, res, next) {
  let {links, scripts} = require("../plugins/PagesManager").style_and_scripts("company");
  res.render('companyViews/company_manageView', { 
    title: 'manage', 
    links: links,
    scripts: scripts
  });
});


module.exports = router;
