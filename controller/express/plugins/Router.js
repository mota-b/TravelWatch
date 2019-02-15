
module.exports = function (app) {


    /**
     * Router Initialisation and Use.
     */
    let admin = require('../routes/adminRoute'),
        index = require('../routes/indexRoute'),
        login = require('../routes/loginRoute'),
        user = require('../routes/userRoute');
    
    app.use('/admin', admin);
    app.use('/', index);
    app.use('/login' || '/register', login);
    app.use('/user', user);

    // API access
    let loginApi = require('../api/loginApi'),
        usersApi = require('../api/usersApi')
    
    app.use('/api/login', loginApi);
    app.use('/api/users', usersApi);

}