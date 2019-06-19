
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
                            +"   <span><i class='fas fa-times-circle'></i></span>"
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

        // list entities item on click event
        $(document).on("click", '#entities-list .list-group-item', (event) => {
            

            let target_id = event.target.id;

            let target_index = 0;
            // LOOP While
            // (not finished with the list of entities)
            //    AND 
            // (The id is differenr from the target given)    
            while(target_index< user.compute_data.entities.length && user.compute_data.entities[target_index]._id != target_id){
                // console.log(markers[index].options.title.split("\n"));
                target_index++
            }

            if(target_index<user.compute_data.entities.length){
                // Set log entity info
                $("#entity_log_name p").html(user.compute_data.entities[target_index].entity_name)
                if(user.compute_data.entities[target_index].entity_type=="Smartphone"){
                    
                    $("#entity_log_icon").removeClass("fa-podcast")
                    $("#entity_log_icon").addClass("fa-mobile")
                }
                else{
                   
                    $("#entity_log_icon").addClass("fa-mobile")
                    $("#entity_log_icon").removeClass("fa-podcast")
                }
               
                
                // Set log-entity history
                $("#log-table tbody").html("")
                user.compute_data.entities[target_index].location_history.forEach(location=>{
                    
                    console.log("9iw");
                    console.log(location);
               
                    $("#log-table tbody").prepend(
                        // <tr>
                        // <th scope="row">1</th>
                        // <td>Mark</td>
                        // <td>Otto</td>
                        
                        // </tr>
                        $("<tr>")
                        .append(
                            $("<th>").attr({"scope":"row"}).append(location.date)
                        ).append(
                            $("<td>").append(location.provider)
                        ).append(
                            $("<td>").append(location.lat_lon.lat)
                        ).append(
                            $("<td>").append(location.lat_lon.lng)
                        )
                    )
                })
                
            }
            
            
            $("#s2").css({
                "display":"block"
            })

            $('html, body').animate({scrollTop:$('#s2').position().top}, 'slow');

        })
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
        
        // On Connect event
        chat.on('connect', function() {
            
            $("#operator_status").html("online").css({
                "color": "#2ecc71"
            })
        });

        // On Disconnect event
        chat.on('disconnect', function() {
            
            $("#operator_status").html("offline").css({
                "color": "#800000"
            })
        })
        
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
                // console.log("hambabak tactiva");
                $("#"+data.entity_id).toggleClass("active")
                
                

                // update item status
                if($("#"+data.entity_id).find("span .fas").hasClass("fa-times-circle")){
                    
                    
                    $("#"+data.entity_id).find("span .fas").toggleClass("fa-times-circle")
                    $("#"+data.entity_id).find("span .fas").toggleClass("fa-check-circle")
                }
            }else{
                // console.log("sayi rani activ");
            }


            let target_marker =  mm.get_marker(main_map.markers, data.entity_name);
            // update the icon img
            // console.log( data.entity_name);
            // console.log(target_marker);
            
            if( target_marker && target_marker.getIcon().options.iconUrl == "/img/taxi_location-gone.png"){
                // console.log("3andi marker");
                mm.update_marker_icon(target_marker,'/img/taxi_location-active.png')
            }else{
                // console.log("ma3andich marker wella l'icon raha nichen mactivya") ;
            }
        })

        // On entity active event
        chat.on("entity_gone", function(data){
            if(data.entity_id&& $("#"+data.entity_id).hasClass("active")){
                $("#"+data.entity_id).toggleClass("active")
                
               
                // update item status
                if($("#"+data.entity_id).find("span .fas").hasClass("fa-check-circle")){
                    $("#"+data.entity_id).find("span .fas").toggleClass("fa-check-circle")
                    $("#"+data.entity_id).find("span .fas").toggleClass("fa-times-circle")
                }
            }


            let target_marker =  mm.get_marker(main_map.markers, data.entity_name);
            // update the icon img
            if( target_marker && target_marker.getIcon().options.iconUrl == "/img/taxi_location-active.png"){
                mm.update_marker_icon( target_marker,'/img/taxi_location-gone.png')
            }

            
        })

        // On chat message event 
        chat.on("entity_location", function(data){


          
            
           
            
            let entity_marker = mm.get_marker(main_map.markers, data.entity_name)
            if(entity_marker){
                
                // update the marker location
                let loc_entity = data.new_location.lat_lon
                mm.update_marker(entity_marker, loc_entity)
                    
                // update the marker popup 
                entity_marker.bindPopup(data.entity_name+"\n["+loc_entity+"]");
                  
            }
            else{
                // console.log("masebtahch nekriyih ?");
                // console.log(data);
                
                
                // create one TODOOOOO
                let icon
                if(data.entity_type=="Smartphone"){
                    icon = "fa-mobile"
                }
                else{
                    icon = "fa-podcast"
                }
                // $("#entities-list ul").append(
                //     // <i class="far fa-check-circle"></i>
                    
                //     "<li class='list-group-item' id='"+entity._id+"'>"
                //     +"   <div class='md-v-line'></div><i class='fas "+ icon +" mr-4'></i>"+entity.entity_name
                //     +"   <span><i class='fas fa-times-circle'></i></span>"
                //     +"</li>" 
                // )


                // Add the entities last knewn location markers
                // if(entity.location_history.length>0){
                    // we have at least 1 stored location
                    // console.log(entity.location_history[entity.location_history.length-1]);
                    // console.log(entity.location_history.length-1);
                    
                    let loc_entity = data.new_location.lat_lon;

                    let messageIcon = data.entity_name+"\n["+loc_entity+"]"
                    mm.add_marker_entity(main_map, loc_entity, messageIcon)

                    let target_marker =  mm.get_marker(main_map.markers, data.entity_name);
                    if(target_marker){
                        mm.update_marker_icon(target_marker,'/img/taxi_location-active.png')
                    }
                    

                // }
            }

            // add the information to the log if it's the entity log
            if( $("#s2").css("display")=="block" && $("#entity_log_name p").html()==data.entity_name){
                
               
                $("#log-table tbody").prepend(
                    // <tr>
                    // <th scope="row">1</th>
                    // <td>Mark</td>
                    // <td>Otto</td>
                    
                    // </tr>
                    $("<tr>")
                    .append(
                        $("<th>").attr({"scope":"row"}).append(data.new_location.date)
                    ).append(
                        $("<td>").append(data.new_location.provider)
                    ).append(
                        $("<td>").append(data.new_location.lat_lon[0])
                    ).append(
                        $("<td>").append(data.new_location.lat_lon[1])
                    )
                )

            }
            

            // Save the last location in the hystory list
            let target_id = data.entity_id;
            let target_index = 0;
            // LOOP While
            // (not finished with the list of entities)
            //    AND 
            // (The id is differenr from the target given)    
            while(target_index< user.compute_data.entities.length && user.compute_data.entities[target_index]._id != target_id){
                // console.log(markers[index].options.title.split("\n"));
                target_index++
            }
            if(target_index<user.compute_data.entities.length){

                // Update log-entity history
               user.compute_data.entities[target_index].location_history.unshift({
                    entity_id: data.entity_id,
                    date: data.new_location.date,
                    provider:data.new_location.provider,
                    lat_lon:{
                        lat:data.new_location.lat_lon[0],
                        lng:data.new_location.lat_lon[1]
                    }
               })
                
            }
            console.log(data);
            

            
            
            
        })

               
    }
} // END Socket client manager
