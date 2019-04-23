



// Main
$(document).ready(function () {
    if (!sessionStorage.getItem("admin")){
        // admin login interface
        admin_log()
    }else{
        // admin dashBoard interface
        admin_dashBoard()
    }   
     
});


// admin Log script
function admin_log (){

    // submit admin login
    $("form").submit(function(event){
        
        event.preventDefault();
        $.ajax( {
            url:'/api/login/log/admin',
            type:"POST",
            data:{
                "username": $(this).find("input[name=username]").val(),
                "password": $(this).find("input[name=password]").val()
            },
            
            success: function(data) { 
                
                if (data.error){ 
                    alert(data.error.message)
                }
                else{
                    sessionStorage.setItem("admin", JSON.stringify(data))
                    window.location.href = "/admin";
                }
            },
            
        });
        return false;
    });
}

// admin DashBoard script
function admin_dashBoard (){

    // Switch log to dashboard display
    $("#log").css({
        'display':'none'
    })
    $("#dashboard").css({
        "display":"block"
    })


    // Database config  
    collection = [] ;
    data_table = null

    // jQuery action event
    actionEvent()

}


// jQuery API request manager
let api_manager = {
    
    // Get a collection
    getCollection : (collection_name, collection) => {
        // Request a collection from the server
        
        $.ajax( {
            url:'/api/'+collection_name,
            type:"GET",     
            headers: {
                token: admin.token
            },   
            success: function(data) { 
                

                if (data.error){ 
                    alert(data.error.message)
                }
                else{

                    if(data.collection && data.collection.length> 0){
                        
                        // Set the collection
                        data.collection.forEach((item) => {
                            collection.push(item)
                        });
                    }else{
                        alert("Empty data responce")
                    }

                    // Config the ui table
                    $("#collection_name").html($("input[name=Collection-name]").val()).css({display:'block'})
                    $("#add").css({display:'inline-block'})
                    
                    // if (data_table!=null) {
                    //     // redraw here to clear the table from previeu collection
                    //     //data_table.draw()
                    //     data_table.data().clear()
                    // }
                    

                    // // Set the jQuery table
                    collection_schema = data.schema
                    new_item_schema = data.new_item_schema
                    // data_table = tableConfig(collection_name, collection)

                    let columns = [],
                    dataset = []
                    
                    // Set the collumns
                    collection_schema.forEach(column => {
                        columns.push({ title: column })
                    });
                    // Set the datataSet
                    collection.forEach(item => {
                        
                        let data_row = []
                        collection_schema.forEach(key => {    
                            data_row.push(item[key])
                        });
                        dataset.push(data_row)
                    });
                    
                    // Creatae the datataTable
                    table_manager.createTable(columns, dataset)
                    
                    
                }
            },
            
        });

    },
    // Get an item
    getItem : (collection_name, item_id) => {
        // Request a collection from the server
        $.ajax( {
            url:'/api/'+collection_name+'/'+item_id,
            type:"GET",     
            headers: {
                token: user.token
            },   
            success: function(data) { 
                
                if (data.error){ 
                    alert(data.error.message)
                }
                else{
                    item = data
                }
            },
            
        });

    },
    // Create an item
    createItem : (collection_name, item) =>{
        $.ajax( {
            url:'/api/'+collection_name+'/',
            type:"POST",
            headers: {
                token: admin.token
            },
            data:{
                "newItem": JSON.stringify(item)
            },
            
            success: function(data) { 
                
                if (data.error){ 
                    // console.log(data);
                    
                    alert(data.error.message)
                }
                else{
                    
                    if(data.isCreated){
                        let editorItem = editor.get(),
                        createdItem = {};
                        
                        
                        let new_row = []
                        collection_schema.forEach(function(key) {
                            
                            if(key == "_id"){
                                new_row.push(data._id)
                                createdItem[key] = data._id
                            }else{
                                createdItem[key] = editorItem[key]
                                new_row.push(createdItem[key])
                            }
                        });
                        collection.push(createdItem) 

                        // add item in the dataTable
                        table_manager.addItem(new_row)
                    }
                }
            },
            
        });
    },
    // Update an item
    updateItem : (collection_name, item_id, item) =>{
        $.ajax( {
            url:'/api/'+collection_name+'/'+item_id,
            type:"PUT",
            headers: {
                token: admin.token
            },
            data:{
                "update": JSON.stringify(item)
            },
            
            success: function(data) { 
                
                if (data.error){ 
                    console.log(data);
                    
                    alert(data.error.message)
                }
                else{
                    if(data.isUpdated){
                        let updatedItem = editor.get();
                        collection[Selected_item_index] = updatedItem
                        
                        let i = 0;
                        let new_row = []
                        collection_schema.forEach(function(key) {
                            new_row.push(collection[Selected_item_index][key])
                        });
                        

                        // Update the table item
                        table_manager.updateItem(Selected_item_index, new_row)
       
                    }
                }
            },
            
        });
    },
    // Delete an item
    deleteItem : (collection_name, item_id) =>{
        
        
        $.ajax( {
            url:'/api/'+collection_name+'/'+item_id,
            type:"DELETE",
            headers: {
                token: admin.token
            },
            
            success: function(data) { 
                
                if (data.error){ 
                    console.log(data);
                    
                    alert(data.error.message)
                }
                else{
                    if(data.isDeleted){

                        /* remove the row from the ui and the collection*/
                        // remove from collection
                        collection.splice(Selected_item_index, 1)
                        
                        // remove from the table
                        table_manager.deleteItem(Selected_item_index)
                        
                        
                    }
                }
            },
            
        });

        
    }
},
// jQuery dataTable  manager
table_manager = {
    // Create the dataTable
    createTable: (columns, dataSet) => {
        if(data_table!=null){
            data_table.clear().destroy().draw()
            $("#table").html("")
        }
        
        // initialise the table
        data_table = $("#table").DataTable({
            data: dataSet,
            columns: columns
        })

    },
    // Update Item in the dataTable
    addItem: (item) => {
        data_table.row.add(item).draw()
    },
    // Update Item in the dataTable
    updateItem: (index, new_row) => {
        data_table.row(index).data(new_row).draw()
    },
    // Remove Item from the dataTable
    deleteItem: (index) => {
        data_table.row(index).remove().draw()
    }
    
},
// jQuery Collection action events
actionEvent = () => {
    // API Collection Request
    $("#get_collection_form").submit(function(event){
        event.preventDefault()

        collection = []
        collection_schema = []
        api_manager.getCollection($("input[name=Collection-name]").val(), collection)

    })
   
    // JSON item Selection
    $(document).on("click", '#table tbody tr', (event) => {
        
        $("#validate").css({"display":"none"})
        $("#update").css({"display":"inline-block"})
        $("#delete").css({"display":"inline-block"})

        Selected_item_index = $(event.target)["0"]._DT_CellIndex.row;
        
        // create the editor
        $("#jsoneditor").html("")
        var container = document.getElementById("jsoneditor");
        var options = {};
        editor = new JSONEditor(container, options);

        // set json
        editor.set(collection[Selected_item_index]);

        // get json
        Selected_item = editor.get();

        //display the modal
        $("#exampleModalCenter").modal("toggle")


    })

    // JSON item update
    $(document).on("click", '#update', (event) => {
        event.preventDefault();

        // get json
        let updated_item = editor.get(),
            toUpdate = {},
            json_isEmpty = true;  
        
        Object.keys(Selected_item).forEach(function(key) {
            if(updated_item[key]!=Selected_item[key]){
                if(json_isEmpty) json_isEmpty = false
                toUpdate[key] = updated_item[key]
                
            }
        });
        
        if(!json_isEmpty){
            api_manager.updateItem($("#collection_name").html(), Selected_item._id, toUpdate)
        }  
    
    })

    // Json item Delete
    $(document).on("click", '#delete', (event) => {
        event.preventDefault();
        
        // get json
        api_manager.deleteItem($("#collection_name").html(), Selected_item._id)
    
    })

    // Json item add
    $(document).on("click", '#add', (event) => {
        event.preventDefault();

        // create the editor
        $("#jsoneditor").html("")
        var container = document.getElementById("jsoneditor");
        var options = {};
        editor = new JSONEditor(container, options);

        // set json
        editor.set(new_item_schema);

        //display the modal
        $("#validate").css({"display":"inline-block"})
        $("#update").css({"display":"none"})
        $("#delete").css({"display":"none"})
        
        $("#exampleModalCenter").modal("toggle")

    })

    // Json new item validation
    $(document).on("click", '#validate', (event) => {
        event.preventDefault();

        
        // get json
        let new_item = editor.get(),
            passwordRegex = /^[A-Z]+\w{2,}$/;

            
        console.log(new_item);
        if(new_item.password && !new_item.password.match(passwordRegex)){
            // This is an email
            alert("wrong password format"+
            "\n1) the password must start with capital letter"+
            "\n2) the password must be longer than 3 letters");
        }else{
            if(new_item !=null){
                api_manager.createItem($("#collection_name").html(), new_item)
            }
        }
        
    })
}
