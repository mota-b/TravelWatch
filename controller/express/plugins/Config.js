/**
 * Module dependencies.
 */
let express = require('express');
    path = require('path');
    morgan = require('morgan');
    cookieParser = require('cookie-parser');
    bodyParser = require('body-parser');
    session = require('express-session')
    cors = require('cors')

module.exports = function (app) {

    // Views and Public paths
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../../view/views'));
    app.use("*/js", express.static(path.join(__dirname, "../../../view/public/javascripts")));
    app.use("*/css", express.static(path.join(__dirname, "../../../view/public/stylesheets")));
    app.use("*/img", express.static(path.join(__dirname, "../../../view/public/media/images")));
    app.use("*/bower", express.static(path.join(__dirname, "../../../view/public/bower_components")));
    //app.use(express.static(path.join(__dirname, '../public')));
    //app.get('/favicon.ico', (req, res) => res.status(204));

    app.use(cors())
    app.use(morgan('dev'));// Output console type ==> see the github
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(session({
         secret: process.env.SESSION_SECRET,
         resave: false,
         saveUninitialized: false
    }));    
}