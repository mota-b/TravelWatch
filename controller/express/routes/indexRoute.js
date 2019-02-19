let router = require('express').Router(),
    pagesManager = require("../plugins/PagesManager")("index");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('indexView', { 
    title: 'Index', 
    links: pagesManager.links,
    scripts: pagesManager.scripts
  });

});

/* log out the user. */
router.get('/logout', function(req, res, next) {
  res.send("<script>sessionStorage.removeItem('user'); localStorage.removeItem('user'); window.location.href = '/';</script>")
});

module.exports = router;
