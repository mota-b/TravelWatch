// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let ClientSchema = new Schema({

        CCP : {type: String, require: true, unique: true}, 
        nom : String, 
        preNom : String , 
        dateNaissence : String,
        lieuNaissence : String, 
        pere: String, 
        mere: String, 
        addresseRue: String, 
        addresseVille: String, 
        nTel: String,
        CNI: String, 
        dateCNI: String, 
        daira: String, 
        fonction: String, 
        salaire: String, 
        organismePayant: String, 
        cle: String, 
        obs: String, 
        dateDepot: String, 
        magasin : String
}) 


// The model
var Client = mongoose.model('client', ClientSchema);


// Import from sQlite
let import_clients_fromSQlite = () => {
        let sqliteManager = require("../controller/expressApp/plugins/SQliteManager")

        //open database
        let database = sqliteManager.sQlite_connect("./", process.env.SQLITE_DB_URL)

        let query = "SELECT * FROM CLIENT ;" 
        database.each(query, (err, data) =>{
                if(err)
                        console.log(err);

                
                let newClient = new Client({
                        CCP : data.CCP, 
                        nom : data.nom, 
                        preNom : data.preNom , 
                        dateNaissence : data.dateNaissence,
                        lieuNaissence : data.lieuNaissence, 
                        pere: data.pere, 
                        mere: data.mere, 
                        addresseRue: data.addresseRue, 
                        addresseVille: data.addresseVille, 
                        nTel: data.nTel,
                        CNI: data.CNI, 
                        dateCNI: data.dateCNI, 
                        daira: data.daira, 
                        fonction: data.fonction, 
                        salaire: data.salaire, 
                        organismePayant: data.organismePayant, 
                        cle: data.cle, 
                        obs: data.obs, 
                        dateDepot: data.dateDepot, 
                        magasin : data.magasin
                })
                newClient.save()

        })

        // Close database
        sqliteManager.sQlite_close(database)

}
//import_clients_fromSQlite ()

//Exporting the model from the schema
module.exports = Client