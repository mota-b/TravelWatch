
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
        company_managersApi = require('../api/company_managersApi')
        operatorsApi = require('../api/operatorsApi')
    
    app.use('/api/login', loginApi);
    app.use('/api/company_managers', company_managersApi);
    app.use('/api/operators', operatorsApi);

}