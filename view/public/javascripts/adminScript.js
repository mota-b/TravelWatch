

// API request manager
let api_manager = {
    
    // Get a collection
    getCollection : (collection_name, collection) => {
        // Request a collection from the server
        $.ajax( {
            url:'/api/'+collection_name+"s",
            type:"GET",     
            headers: {
                token: user.token
            },   
            success: function(data) { 
                
                if (data.error){ 
                    alert(data.error.message)
                }
                else{
                    
                    data.forEach((item) => {
                        collection.push(item)
                    });

                    // Config the ui table
                    tableConfig(collection_name, collection)
                }
            },
            
        });

    },

    // Get an item
    getItem : (collection_name, item_id, item) => {
        // Request a collection from the server
        $.ajax( {
            url:'/api/'+collection_name+'s/'+item_id,
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

    // Get the collection schemas
    getSchemas : () => {
        return {
            "user": [
                "_id",
                "username", 
                "email", 
                "isAdmin"
            ]
        }
    }

}

// Main
$(document).ready(function () {

    // Database config  
    users = [] ;
    api_manager.getCollection("user", users)

    //JSON item Selection
    $(document).on("click", '#dtBasicExample tbody tr', (event) => {
        Selected_item_index = $(event.target)["0"]._DT_CellIndex.row;
        
        // create the editor
        $("#jsoneditor").html("")
        var container = document.getElementById("jsoneditor");
        var options = {};
        editor = new JSONEditor(container, options);

        // set json
        editor.set(users[Selected_item_index]);

        // get json
        Selected_item = editor.get();

    })

    $(document).on("click", '#update', (event) => {
        event.preventDefault();

        // get json
        let updated_item = editor.get(),
            toUpdate = {},
            isEmpty = true;  
        // console.log(Selected_item);
        // console.log(updated_item);
        
        Object.keys(Selected_item).forEach(function(key) {
            if(updated_item[key]!=Selected_item[key]){
                if(isEmpty) isEmpty = false
                toUpdate[key] = updated_item[key]
                
            }
        });
        
        if(!isEmpty){
            $.ajax( {
                url:'/api/users/'+Selected_item._id,
                type:"PUT",
                data:{
                    "user_updated": JSON.stringify(toUpdate)
                },
                
                success: function(data) { 
                    
                    if (data.error){ 
                        alert(data.error.message)
                    }
                    else{
                        if(data.isUpdated){
                            users[Selected_item_index] = updated_item
                            
                            let i = 0;
                            Object.keys(users[Selected_item_index]).forEach(function(key) {
                                $("#dtBasicExample tbody").find("tr").eq(Selected_item_index)
                                    .find("td").eq(i).text(users[Selected_item_index][key])
                                i = i+1    
                            });
                            
                        }
                    }
                },
                
            });
        }        
    })

     
});



// Database config
tableConfig = (collection_name, collection) =>{

    let col = collection

    // Clearing and building the table head
    $('#dtBasicExample').find("thead tr").html("")
    let schema = api_manager.getSchemas()[collection_name]
    schema.forEach((key) =>{
        $('#dtBasicExample').find("thead tr").append(
            $("<th>").addClass("th-sm").text(key)
        )
    })

    // Clearing and building the table body
    $('#dtBasicExample').find("tbody").html("")
    col.forEach(function (item) {
        //console.log(item);
        $('#dtBasicExample').find("tbody").append(
            $("<tr>").addClass("waves-effect waves-light")
                    .attr( {
                        "data-toggle":"modal",
                        "data-target":"#exampleModalCenter"
                    })
        )
        schema.forEach((key) =>{
            $('#dtBasicExample').find("tbody tr").last().append(
                $("<td>").addClass("th-sm").text(item[key])
            )
        })
    })
    
     

    $('#dtBasicExample').DataTable();
    $('.dataTables_length').addClass('bs-select');    
}

