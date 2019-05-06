
/**
 * Module dependencies.
 */
let mongoose = require('mongoose');

module.exports = function(){
    mongoose.Promise = global.Promise;
    let db_url = process.env.DB_URL;
    
    mongoose.connect(db_url, { useNewUrlParser: true })
        .then(() =>  console.log('-- Connection succesful to db: <<', db_url.split('/')[3], '>>'))
        .catch((err) => console.error(err));
}