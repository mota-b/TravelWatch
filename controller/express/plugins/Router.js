
module.exports = function (app) {


    /**
     * Router Initialisation and Use.
     */
    let admin = require('../routes/adminRoute'),
        index = require('../routes/indexRoute'),
        login = require('../routes/loginRoute'),
        company = require('../routes/companyRoute'),
        operator = require('../routes/operatorRoute');
        // mate = require('../routes/mateRoute');
    
    app.use('/admin', admin);
    app.use('/', index);
    app.use('/login' || '/register', login);
    app.use('/company', company);
    app.use('/operator', operator);
    // app.use('/mate', mate);

    // API access
    let loginApi = require('../api/loginApi'),
        company_managersApi = require('../api/company_managersApi'),
        operatorsApi = require('../api/operatorsApi'),
        entitiesOfInterestApi = require('../api/entitiesOfInterestApi'),
        matesApi = require('../api/matesApi'),
        adminsApi = require('../api/adminsApi');

    app.use('/api/login', loginApi);
    app.use('/api/company_managers', company_managersApi);
    app.use('/api/operators', operatorsApi);
    app.use('/api/entities', entitiesOfInterestApi);
    app.use('/api/mates', matesApi);
    app.use('/api/admins', adminsApi);
    app.use('/api/', (req, res, next) =>{
        res.json({error : {message: "This api doesn't exist"}})
    });

}