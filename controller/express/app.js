
/**
 * Module dependencies.
 */
let express = require('express'),
  app = express();


/**
 * Express Config
 */ 
require('./plugins/Config')(app);

/**
 * Mongoose Data Base
 */
require('./plugins/Mongo')();


/**
 * Security basic
 */
require('./plugins/Security')(app);

/**
 * Passport
 */
require('./plugins/Passport')(app);

/**
 * Router initialising
 */
require('./plugins/Router')(app); 

/**
 * Error handeling
 */
require('./plugins/ErrHundler')(app);


module.exports = app;