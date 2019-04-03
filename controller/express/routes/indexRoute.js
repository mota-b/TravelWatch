let router = require('express').Router(),
    {links, scripts} = require("../plugins/PagesManager").style_and_scripts("index");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('indexView', { 
    title: 'Index', 
    links: links,   
    scripts: scripts
  });

});

/* log out the user. */
router.get('/logout', function(req, res, next) {
  res.send("<script>sessionStorage.removeItem('user'); localStorage.removeItem('user'); window.location.href = '/';</script>")
});

module.exports = router;
