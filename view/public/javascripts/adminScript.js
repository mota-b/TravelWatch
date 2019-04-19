



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

    // switch log to dashboard display
    $("#log").css({
        'display':'none'
    })
    $("#dashboard").css({
        "display":"block"
    })


    // Database config  
    collection = [] ;
    data_table = null
    $("#get_collection_form").submit(function(event){
        event.preventDefault()

        collection = []
        collection_schema = []
        api_manager.getCollection($("input[name=Collection-name]").val(), collection)

        
        if (data_table!=null) {
            // redraw here to prevent infinit table without pages
            setTimeout(() =>{
                data_table.draw()
            }, 500) 
        }

    })
    
   
    // JSON item Selection
    $(document).on("click", '#dtBasicExample tbody tr', (event) => {
        
        
        Selected_item_index = $(event.target)["0"]._DT_CellIndex.row;
        console.log("index");
        console.log(Selected_item_index);
        
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
        // console.log(Selected_item);
        // console.log(updated_item);
        
        Object.keys(Selected_item).forEach(function(key) {
            if(updated_item[key]!=Selected_item[key]){
                if(json_isEmpty) json_isEmpty = false
                toUpdate[key] = updated_item[key]
                
            }
        });
        
        if(!json_isEmpty){
            api_manager.updateItem($("#collection_name").html(), Selected_item._id, toUpdate)
        }  
        
        
        // re draw the table (not a reload just re draw) 
        data_table.draw()
    })

    // Json item Delete
    $(document).on("click", '#delete', (event) => {
        event.preventDefault();

        
        // get json
        api_manager.deleteItem($("#collection_name").html(), Selected_item._id)
        

        // re draw the table (not a reload just re draw) 
        data_table.draw()
    })
}


// API request manager
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
                    
                    if (data_table!=null) {
                        // redraw here to clear the table from previeu collection
                        //data_table.draw()
                        data_table.data().clear()
                    }
                    

                    // Set the jQuery table
                    collection_schema = data.schema
                    data_table = tableConfig(collection_name, collection)


                    
                }
            },
            
        });

    },

    // Get an item
    getItem : (collection_name, item_id, item) => {
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
                        data_table.row(10).data(new_row).draw()
                        

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

                        /* remove the row from the ui*/
                        // remove from collection
                        collection.splice(Selected_item_index, 1)
                        // remove from table to prevent reload the hole collection
                        data_table.row(Selected_item_index).remove()
                        // re draw the table (not a reload just re draw) 
                        data_table.draw()
                    }
                }
            },
            
        });

        
    }
}

// Database config
tableConfig = (collection_name, collection) =>{

    //let col = collection
    

    // Clearing and building the table head
    $('#dtBasicExample').find("thead tr").html("")
    
    collection_schema.forEach((key) =>{
        $('#dtBasicExample').find("thead tr").append(
            $("<th>").addClass("th-sm").text(key)
        )
    })

    // Clearing and building the table body
    $('#dtBasicExample').find("tbody").html("")    
    
    let table = $('#dtBasicExample').DataTable();


    collection.forEach(function (item) {
        let row = []

        collection_schema.forEach((key) =>{
            row.push(item[key]) 
        })
        
        table.row.add( row ).draw( false );
    })

    $('.dataTables_length').addClass('bs-select');    
    
    
    
    return table;
}

