// Requires
let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// The schema
let ProductSchema = new Schema({

    Code : {type: String, require: true, unique: true}, 
    Name : String, 
    Family : String, 
    Qnt : String,
    Price : String, 
    Date : String,
    FirstVers : String, 
    Mensuality : String,
    NbrMonths : String, 
    NumeroSerie : String
}) 


// The model
var Product = mongoose.model('product', ProductSchema);


// Import from sQlite
let import_products_fromSQlite = () => {
        let sqliteManager = require("../controller/expressApp/plugins/SQliteManager")

        //open database
        let database = sqliteManager.sQlite_connect("./", process.env.SQLITE_DB_URL)

        let query = "SELECT * FROM PRODUIT ;" 
        database.each(query, (err, data) =>{
                if(err)
                        console.log(err);

                
                let newProduct = new Product({
                    Code : data.Code, 
                    Name : data.Name, 
                    Family : data.Family, 
                    Qnt : data.Qnt,
                    Price : data.Price, 
                    Date : data.Date,
                    FirstVers : data.FirstVers, 
                    Mensuality : data.Mensuality,
                    NbrMonths : data.NbrMonths, 
                    NumeroSerie : data.NumeroSerie
                })
                newProduct.save()

        })

        // Close database
        sqliteManager.sQlite_close(database)

}
//import_products_fromSQlite ()

//Exporting the model from the schema
module.exports = Product