
// Main
$(document).ready(function(){  


    /**
     * Socket part
     */
    chat = null;
    // Check if there client is loged and no preview connection
    if(user && !chat){
        scm =  socketClientManager
        
        // Connect to the main socket
        chat = scm.connect_namespace("/");

        // Load namespace event
        scm.load_namespace_events();

        
        // Load pendig conversations
        //chat.emit("contact list")
    }


    /**
     * Data needed part
     */
    if(user){

        // get self data
        $.ajax( {
            url:'/api/operators/self/'+user.ui_data._id,
            type:"GET",
            headers: {
                token: user.token
            },   
            
            success: function(data) { 
                
                if (data.error){ 
                    alert(data.error.message)
                }
                else{
                    // console.log(data);
                    user.compute_data = data


                    // Set the operator Info
                    $("#operator_name").html(user.ui_data.username)
                    $("#operator_post").html("Operator")

                    $("#company_name").html(data.c_manager.company_name)
                    $("#c_manager_name").html(data.c_manager.username)

                    // Add the homebase marker
                    let company_location = user.compute_data.c_manager.company_location,
                    loc_homeBase = [company_location.lat, company_location.lon];

                    mm.add_marker_home(main_map, loc_homeBase, "home-base")

                    let marker_home =  mm.get_marker(main_map.markers, "home-base");
                    if(marker_home){
                        mm.fly_to(main_map.map, marker_home, 15)
                    }else{
                        console.log("marker home not found");  
                    }


                
                    // Add the entities list items 
                    data.entities.forEach(entity => {
                        let icon
                        if(entity.entity_type=="Smartphone"){
                            icon = "fa-mobile"
                        }
                        else{
                            icon = "fa-podcast"
                        }
                        $("#entities-list ul").append(
                            // <i class="far fa-check-circle"></i>
                            
                            "<li class='list-group-item' id='"+entity._id+"'>"
                            +"   <div class='md-v-line'></div><i class='fas "+ icon +" mr-4'></i>"+entity.entity_name
                            +"   <span><i class='fas fa-times-circle ml-4'></i></span>"
                            +"</li>" 
                        )


                        // Add the entities last knewn location markers
                        if(entity.location_history.length>0){
                            // we have at least 1 stored location
                            // console.log(entity.location_history[entity.location_history.length-1]);
                            // console.log(entity.location_history.length-1);
                            
                            let entity_location = entity.location_history[entity.location_history.length-1].lat_lon,
                                loc_entity = [entity_location.lat, entity_location.lng];

                            let messageIcon = entity.entity_name+"\n["+loc_entity+"]"
                            mm.add_marker_entity(main_map, loc_entity, messageIcon)

                        }
                         
                    });
  
                }
            },
            
        });
    }


    /**
     * Main-Map part
     */
    if(user){
        
        
        main_map = {
            map: mm.createmap("main-map",[35.705839, -0.631704], 13),
            markers: [],
            arcs: []
        }

        
        // mm.add_marker(main_map, loc1, "normal")
       
        
        
        // mm.add_marker_entity(main_map, loc1, "taxi")
        // setInterval(()=>{
        //     mm.update_marker(main_map.markers[1], [main_map.markers[1].getLatLng().lat,main_map.markers[1].getLatLng().lng+0.001])
        // },1000)
    }




    
})



let 
// Socket client manager
socketClientManager = {
    // connect to the main socket (the crowd)
    connect_namespace : (nsp) => {
        
        if (user){
            
        
            return io( nsp, {
                query: {
                    // email: user.email,
                    token: user.token
                }
            })
        }else{
            return null
        }
    },

    // Load crowd events
    load_namespace_events:  () => {
        
        // On chat message event 
        chat.on("chat message", function(data){


            // Check if I am the sender 
            //let item_class = ""
            if(user.username == data.sender){
                
                // Yes I am
                console.log("message from myself")
                newMessage(data)
                

            }else{

                // No I am Not
                console.log("message from: ", data.sender)
                
                

                // Check if the contact is in the contact list
                if (!contacts[data.sender]){
                    // Not in the Contact list ==> append to it
                    contacts[data.sender] = {
                        "history": [data]
                    }

                    // Not in the UI Contact list ==> append to it
                    console.log(contacts[data.sender].history);
                    console.log(contacts[data.sender].history.length);
                    
                    newContact(data.sender, contacts[data.sender].history[contacts[data.sender].history.length-1].msg)
                }
                
                // Pushing the message to the history of the contact
                //contacts[data.contact].history.push({"msg":data.msg, "contact":data.contact})
                
                
                // The focus is on the contact
                if($("#head-profile .name").text() == data.sender){
                    
                    // Appending own messagers
                    newMessage(data)
                    
                   
                }else{

                    // The focus is not on the contact ==> Not realy paying attention !!! notify to me
                    
                    
                    $(".meta p.name#"+data.from+" .badge").remove()
                    $(".meta p.name:contains('"+data.from+"')").attr({id: data.from})
                        .append(       
                            $("<span>").addClass("badge")
                                .text("new").css({
                                    background: "red",
                                    color: "snow !important",
                                    height: "20px",
                                    width: "35px",
                                    right: "0px",
                                    position: "relative",
                                    float: "right",
                                })
                        )
                        
                }
                
                
                
            }

            
            

            

           

            
        
            
            console.log(data)
            
        }),

        // On contact list event
        chat.on("contact list", function (data) {
            contacts = data

            for (const key in contacts) {
                // newContact ==> contact_name, last_message
                newContact(key, contacts[key].history[contacts[key].history.length-1].msg)
                
            }
        }),
        
        // On entity active event
        chat.on("entity_active", function(data){
            if(data.entity_id&& !$("#"+data.entity_id).hasClass("active")){
                $("#"+data.entity_id).toggleClass("active")
            }
        })

        // On entity active event
        chat.on("entity_gone", function(data){
            if(data.entity_id&& $("#"+data.entity_id).hasClass("active")){
                $("#"+data.entity_id).toggleClass("active")
            }
        })

        // On chat message event 
        chat.on("entity_location", function(data){


          
            let item_class = ""
            // console.log("location from: ", data.entity_id)
            
            let entity_marker = mm.get_marker(main_map.markers, data.entity_name)
            if(entity_marker){
                // update the marker location
                let loc_entity = data.new_location.lat_lon
                mm.update_marker(entity_marker, loc_entity)
                    
                // update the marker popup 
                entity_marker.bindPopup(data.entity_name+"\n["+loc_entity+"]");
                //    console.log(entity_marker.options.title.split("\n"));

                // notify the entity is actif

            }
            else{
                // create one
            }

            // Check if the contact is in the contact list

            // Check if the location sender is in the entities list
            // if (!contacts[data.sender]){
            //     // Not in the Contact list ==> append to it
            //     // contacts[data.sender] = {
            //     //     "history": [data]
            //     // }

            //     // Not in the UI Contact list ==> append to it
            //     console.log(contacts[data.sender].history);
            //     console.log(contacts[data.sender].history.length);
                
            //     newContact(data.sender, contacts[data.sender].history[contacts[data.sender].history.length-1].msg)
            // }
            
            // Pushing the message to the history of the contact
            // contacts[data.contact].history.push({"msg":data.msg, "contact":data.contact})
            
            
            // The focus is on the contact
            // if($("#head-profile .name").text() == data.sender){
                
            //     // Appending own messagers
            //     newMessage(data)
                
                
            // }else{

            //     // The focus is not on the contact ==> Not realy paying attention !!! notify to me
                
                
            //     $(".meta p.name#"+data.from+" .badge").remove()
            //     $(".meta p.name:contains('"+data.from+"')").attr({id: data.from})
            //         .append(       
            //             $("<span>").addClass("badge")
            //                 .text("new").css({
            //                     background: "red",
            //                     color: "snow !important",
            //                     height: "20px",
            //                     width: "35px",
            //                     right: "0px",
            //                     position: "relative",
            //                     float: "right",
            //                 })
            //         )
                    
            // }
                
                
                
         

            // console.log(data)
            
        })

               
    }
} // END Socket client manager
