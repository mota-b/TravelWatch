
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
        locationsApi = require('../api/locationsApi'),
        matesApi = require('../api/matesApi'),
        adminsApi = require('../api/adminsApi');
        

    app.use('/api/login', loginApi);
    app.use('/api/company_managers', company_managersApi);
    app.use('/api/operators', operatorsApi);
    app.use('/api/entities', entitiesOfInterestApi);
    app.use('/api/locations', locationsApi);
    app.use('/api/mates', matesApi);
    app.use('/api/admins', adminsApi);
    
    // oussama electroFacility test
    // app.get("/api/clients", (req, res, next) =>{

    //     let Client = require("../../../model/ClientModel")
    //     // Return Collection list
    //     Client.find({}, (err, clients) => {
    //         if (clients){
    //             let data = [];
    //             clients.forEach( (client) => {
    //                 data.push({
    //                     CCP : client.CCP, 
    //                     nom : client.nom, 
    //                     preNom : client.preNom , 
    //                     dateNaissence : client.dateNaissence,
    //                     lieuNaissence : client.lieuNaissence, 
    //                     pere: client.pere, 
    //                     mere: client.mere, 
    //                     addresseRue: client.addresseRue, 
    //                     addresseVille: client.addresseVille, 
    //                     nTel: client.nTel,
    //                     CNI: client.CNI, 
    //                     dateCNI: client.dateCNI, 
    //                     daira: client.daira, 
    //                     fonction: client.fonction, 
    //                     salaire: client.salaire, 
    //                     organismePayant: client.organismePayant, 
    //                     cle: client.cle, 
    //                     obs: client.obs, 
    //                     dateDepot: client.dateDepot, 
    //                     magasin : client.magasin
                    
    //                 })
    //             });

    //             // Table display Schema
    //             let client_schema = [
    //                     "CCP", 
    //                     "nom", 
    //                     "preNom", 
    //                     "dateNaissence",
    //                     "lieuNaissence", 
    //                     "pere", 
    //                     "mere", 
    //                     "addresseRue", 
    //                     "addresseVille", 
    //                     "nTel",
    //                     "CNI", 
    //                     "dateCNI", 
    //                     "daira", 
    //                     "fonction", 
    //                     "salaire", 
    //                     "organismePayant", 
    //                     "cle", 
    //                     "obs", 
    //                     "dateDepot", 
    //                     "magasin"
    //             ],
    //             // New Item Create Schema
    //             new_item_schema = { 
                   
    //             }

    //             // Return result
    //             res.json({collection: data, schema: client_schema, new_item_schema: new_item_schema})
    //         }
    //     })
       
    // })
    
    // app.get("/api/commands", (req, res, next) =>{

    //     let Command = require("../../../model/CommandModel")
    //     // Return Collection list
    //     Command.find({}, (err, commands) => {
    //         if (commands){
    //             let data = [];
    //             commands.forEach( (command) => {
    //                 data.push({
    //                     CCP : command.CCP,
    //                     Code : command.Code, 
    //                     Monsuality : command.Monsuality, 
    //                     MoisTotale : command.MoisTotale, 
    //                     Montant : command.Montant,
    //                     PremierVersement : command.PremierVersement, 
    //                     DatePremierVersement : command.DatePremierVersement,
    //                     DateVersementFinale : command.DateVersementFinale, 
    //                     Authorisation : command.Authorisation, 
    //                     QNT : command.QNT,
    //                     NumeroSerie : command.NumeroSerie, 
    //                     DateCreationCommande : command.DateCreationCommande,
                    
    //                 })
    //             });

    //             // Table display Schema
    //             let command_schema = [
    //                 "CCP",
    //                 "Code", 
    //                 "Monsuality", 
    //                 "MoisTotale", 
    //                 "Montant",
    //                 "PremierVersement", 
    //                 "DatePremierVersement",
    //                 "DateVersementFinale", 
    //                 "Authorisation", 
    //                 "QNT" ,
    //                 "NumeroSerie", 
    //                 "DateCreationCommande"
    //             ],
    //             // New Item Create Schema
    //             new_item_schema = { 
                   
    //             }

    //             // Return result
    //             res.json({collection: data, schema: command_schema, new_item_schema: new_item_schema})
    //         }
    //     })
       
    // })

    // app.get("/api/products", (req, res, next) =>{

    //     let Product = require("../../../model/ProductModel")
    //     // Return Collection list
    //     Product.find({}, (err, products) => {
    //         if (products){
    //             let data = [];
    //             products.forEach( (product) => {
    //                 data.push({
    //                     Code : product.Code, 
    //                     Name : product.Name, 
    //                     Family : product.Family, 
    //                     Qnt : product.Qnt,
    //                     Price : product.Price, 
    //                     Date : product.Date,
    //                     FirstVers : product.FirstVers, 
    //                     Mensuality : product.Mensuality,
    //                     NbrMonths : product.NbrMonths, 
    //                     NumeroSerie : product.NumeroSerie
                    
    //                 })
    //             });

    //             // Table display Schema
    //             let product_schema = [
    //                 "Code", 
    //                 "Name", 
    //                 "Family", 
    //                 "Qnt",
    //                 "Price", 
    //                 "Date",
    //                 "FirstVers", 
    //                 "Mensuality",
    //                 "NbrMonths", 
    //                 "NumeroSerie"
    //             ],
    //             // New Item Create Schema
    //             new_item_schema = { 
                   
    //             }

    //             // Return result
    //             res.json({collection: data, schema: product_schema, new_item_schema: new_item_schema})
    //         }
    //     })
       
    // })

    app.use('/api/', (req, res, next) =>{
        res.json({error : {message: "This api doesn't exist"}})
    });

}