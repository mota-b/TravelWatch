// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let CommandSchema = new Schema({

    CCP : String,
    Code : String, 
    Monsuality : String, 
    MoisTotale : String, 
    Montant : String,
    PremierVersement : String, 
    DatePremierVersement : String,
    DateVersementFinale : String, 
    Authorisation : String, 
    QNT : String,
    NumeroSerie : String, 
    DateCreationCommande : String,
}) 


// The model
var Command = mongoose.model('command', CommandSchema);


// Import from sQlite
let import_commands_fromSQlite = () => {
        let sqliteManager = require("../controller/expressApp/plugins/SQliteManager")

        //open database
        let database = sqliteManager.sQlite_connect("./", process.env.SQLITE_DB_URL)

        let query = "SELECT * FROM COMMANDE ;" 
        database.each(query, (err, data) =>{
                if(err)
                        console.log(err);

                
                let newCommand = new Command({
                    CCP : data.CCP,
                    Code : data.Code, 
                    Monsuality : data.Monsuality, 
                    MoisTotale : data.MoisTotale, 
                    Montant : data.Montant,
                    PremierVersement : data.PremierVersement, 
                    DatePremierVersement : data.DatePremierVersement,
                    DateVersementFinale : data.DateVersementFinale, 
                    Authorisation : data.Authorisation, 
                    QNT : data.QNT,
                    NumeroSerie : data.NumeroSerie, 
                    DateCreationCommande : data.DateCreationCommande,
                })
                newCommand.save()

        })

        // Close database
        sqliteManager.sQlite_close(database)

}
//import_commands_fromSQlite ()

//Exporting the model from the schema
module.exports = Command