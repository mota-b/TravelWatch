



// Main
$(document).ready(function () {
    
    // c_manager dashBoard interface
    c_manager_dashBoard()
       
     
});




// admin DashBoard script
function c_manager_dashBoard (){

    // switch log to dashboard display
    $("#log").css({
        'display':'none'
    })
    $("#dashboard").css({
        "display":"block"
    })


    // Database config  
    collection = [] ;
    $("#get_collection_form").submit(function(event){
        event.preventDefault()

        collection = [] ;
        api_manager.getCollection($("input[name=Collection-name]").val(), collection)

    })
    
   
    // JSON item Selection
    $(document).on("click", '#dtBasicExample tbody tr', (event) => {
        console.log($(event.target));
        console.log($(this));
        
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
    })

    // Json item Delete
    $(document).on("click", '#delete', (event) => {
        event.preventDefault();

        
        // get json
        api_manager.deleteItem($("#collection_name").html(), Selected_item._id)
        
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
                token: user.token
            },   
            success: function(data) { 
                

                if (data.error){ 
                    alert(data.error.message)
                }
                else{

                    //collection = []
                    if(data.collection && data.collection.length> 0){
                        data.collection.forEach((item) => {
                            collection.push(item)
                        });

                        
                        // Config the ui table
                        $("#collection_name").html($("input[name=Collection-name]").val()).css({display:'block'})
                        collection_schema = data.schema
                        data_table = tableConfig(collection_name, collection)
                    }else{
                        alert("Empty data responce")
                        
                    }
                    
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
                token: user.token
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
                        collection_schema.forEach(function(key) {
                            $("#dtBasicExample tbody").find("tr").eq(Selected_item_index)
                                .find("td").eq(i).text(collection[Selected_item_index][key])
                            i = i+1    
                        });
                        
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
                token: user.token
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
    collection.forEach(function (item) {
        //console.log(item);
        $('#dtBasicExample').find("tbody").append(
            $("<tr>").addClass("waves-effect waves-light trow")
                    .attr( {
                        "data-toggle":"modal",
                        "data-target":"#exampleModalCenter"
                    })
        )
        collection_schema.forEach((key) =>{
            $('#dtBasicExample').find("tbody tr").last().append(
                $("<td>").addClass("th-sm").text(item[key])
            )
        })
    })
    
    

    let table = $('#dtBasicExample').DataTable();
    $('.dataTables_length').addClass('bs-select');    
    
    
    return table;
}

