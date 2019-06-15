
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
     * Main-Map part
     */
    if(user){
        main_map = {
            map: mm.createmap("main-map",[35.705839, -0.631704], 13),
            markers: [],
            arcs: []
        }

        let loc1 = [35.705839, -0.631704]
        // mm.add_marker(main_map, loc1, "normal")
        mm.add_marker_home(main_map, loc1, "home-base")
        
        
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
        })

               
    }
} // END Socket client manager
