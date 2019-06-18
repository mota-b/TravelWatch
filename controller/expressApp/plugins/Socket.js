
// Socket Server Manager
let ssm = require("./SocketServerManager")
// Models 
let Operator = require("../../../model/OperatorModel");
   



/**
 * Main crowd socket
 */
module.exports = function (crowd) {

    /**
     * Clear the Main-Socket cash on server load/reload
     */
    ssm.reload(crowd);

    /**
     * Main-Socket [Middleware]
     */
    // Crowd Socket authentification middleware 
    crowd.use((socket_client, next) => { 
        
        //console.log("the use middle ware");
        

        // Check and authentify the socket_client
        let v = ssm.is_user(socket_client) || ssm.is_entityOfInterest(socket_client)
        
        
        if( v ){
            
            // console.log(socket_client.user);
            
            //LOG console.log("the user is valid");
    
            // Initialise the socket_clients socket list
            if( !crowd["socket_clients_"] ){
                crowd["socket_clients_"] = {}
            }

            //LOG console.log("there is a global list BEFORE");
            //LOG console.log(crowd.socket_clients_);

            // The list existe ==>
            // Add curent socket_client to global list if doesn't exist in it already
            let username = socket_client.user.username;
                

            // Check if the user exist in the global namespace list 
            //    && Check if the user has anready an old socket bound to the server
            if (crowd.socket_clients_[username] && crowd.sockets[socket_client.user.socket_id]){
                // close old socket by id of user
                // swap curent socket id of same user
                old_socket = ssm.get_scoket(crowd, username);
                old_socket.disconnect()
                crowd.socket_clients_[username].socket_id = socket_client.id

            }else{
                // The user has no preview socket bound
                crowd.socket_clients_[username] = socket_client.user;       
            }

            next();
            
        }else{
            // Not a valid socket_client ==> disconnect his socket
            console.log("Invalid user from socket ==> disconnected");
            socket_client.disconnect()
        }
         
        
        
    })
  
    /**
     * Main-Socket [Events]
     */
    // On Socket connect event
    crowd.on('connection', function(socket_client){
        

        // Wellcome to the crowd socket
        console.log("\n[Welcome!]\n<< ", socket_client.user.username, ' >> of ID: ', socket_client.id, ' is connected to the namespace ',socket_client.nsp.name);
        
        // socket_clients of the namespace
        console.log("\n[Namespace Log!]\nsocket_clients of the namespace ",socket_client.nsp.name, ": {" );
        Object.keys(crowd.socket_clients_).forEach(function(key) {
            console.log("\t* ", key, " ==> socket_ID: ", crowd.socket_clients_[key].socket_id)
        });
        console.log("}");



        /**
         * Socket_client [Events]
         */
        // On contact list event 
        socket_client.on("entity_location", (data) =>{
            // console.log(data);

           
            // TODO change room name to operator id
            let from_id = socket_client.user._id,
                to_id = socket_client.user.operator,
                // room = ssm.get_roomName({from:from, to:to})
                room = to_id
                // console.log("room: ", room);
                // console.log("from: ", from_id);

                /**
                 * [TODO-->NOT_ONLINE==>emmit(dont-send)==>Economy] 
                 */
                // Check if the operator is online 
                // first get it's socket
                let operator_socket = ssm.get_socketByID(crowd, to_id);
                // console.log("op socket: ", operator_socket.user);

                if(operator_socket){
                    console.log("The sender & receiver are both connected")


                    // Check if target is inside room
                    if(crowd.adapter.rooms[room] && crowd.adapter.rooms[room].sockets[operator_socket.id]){
                        // Target inside room
                        console.log(to_id, " is connected in the room") 
                    }else{
                        // Target not inside room
                        console.log(to_id, " is joining ", room)
                        operator_socket.join(room); 
                    }

                    // Check if socket_client is inside the room
                    if(crowd.adapter.rooms[room] && crowd.adapter.rooms[room].sockets[operator_socket.id]){
                        // socket_client is inside room
                        console.log(from_id, " is connected in the room") 
                    }else{
                        // socket_client is not inside the room
                        console.log(from_id, " is joining ", room)
                        socket_client.join(room); 
                    }

                    
                    
                    // Sending the data to the room 
                    crowd.to(room).emit("entity_location", {entity_id: from_id, entity_name: socket_client.user.entity_name, new_location: data})
                    crowd.to(room).emit("entity_active", {entity_id: from_id})
                
                }
                else{
                    // Someone is missing in the room
                    console.log("Someone is missing ")

                    // notify not here 
                    // socket_client.emit("contact offline")


                   
                }
                
                // UNCOMMENT TO SAVE in DB
                // Anymaw Saving message to database
                // ssm.newLocation(socket_client.user, room, data)
        })
        

        // On chat message event ==> when a user send a message to an other
        socket_client.on("chat message", function(data){
            
            // TODO notify socket_client new message on connection :: database notification :: to be checked on connection 
            // TODO change room name to c_manager id
            let from = data.sender,
                to = data.to,
                room = ssm.get_roomName({from:from, to:to})
                console.log("room: ", room);
            
                
            // Check legible Request ==> Prevent ID Spoofing //TODO change to 1 of c_manager entities
            if(socket_client.user.username != from){
                // SPOOFER SPOTTED                
                let Spoofer_addr = socket_client.handshake.address
                console.log("Spoofing Identity attemp ")
                console.log("Spoofer: address "+Spoofer_addr)
                console.log("ID Spoofed: "+from)
                console.log("Destination : "+to)
                console.log("Content: "+data.msg)

                socket_client.disconnect()
            }else{
                // NOT a SPOOFER 

                // Check if the target is online
                // TODO change to cmanager id
                let target_socket = ssm.get_socket(crowd, to);
                if(target_socket){
                    console.log("The chatters ar both connected")

                    // Check if socket_client is inside the room
                    if(crowd.adapter.rooms[room] && crowd.adapter.rooms[room].sockets[target_socket.id]){
                        // socket_client is inside room
                        console.log(from, " is connected in the room") 
                    }else{
                        // socket_client is not inside the room
                        console.log(from, " is joining ", room)
                        socket_client.join(room); 
                    }

                    // Check if is inside room
                    if(crowd.adapter.rooms[room] && crowd.adapter.rooms[room].sockets[target_socket.id]){
                        // Target inside room
                        console.log(to, " is connected in the room") 
                    }else{
                        // Target not inside room
                        console.log(to, " is joining ", room)
                        target_socket.join(room); 
                    }
                    
                    // Sending the data to the room 
                    crowd.to(room).emit("chat message", data)

                    // Saving message to database
                    ssm.newMessage(socket_client.user, room, data)

                    
                }else{
                    // Someone is missing in the room
                    console.log("Someone is missing ")

                    // notify not here 
                    socket_client.emit("contact offline")

                    // Saving message to database
                    ssm.newMessage(socket_client.user, room, data)
                }
            }

        })

        // On socket_client Disconnect event
        socket_client.on("disconnect", function () {
            // if is_entity notify the operator
            // obviously an entity has an operator
            if(socket_client.user.operator){
                let room = socket_client.user.operator
                crowd.to(room).emit("entity_gone", {entity_id: socket_client.user._id})

            } 
            
            console.log("\n[Good by!]\n ", "<< ",socket_client.user.username," >> of ID: ", socket_client.id," from ", socket_client.nsp.name )
            delete crowd.socket_clients_[socket_client.user.username]

            // socket_clients of the namespace
            console.log("\n[Namespace Log!]\nsocket_clients of the namespace ",socket_client.nsp.name, ": {" );
            Object.keys(crowd.socket_clients_).forEach(function(key) {
                console.log("\t* ", key)
            });
            console.log("}");

            delete socket_client.user
        })

        // On deliberate quit socket_client event
        socket_client.on("quit", function () {
            console.log("A quit from ", socket_client.user.username);
            
            delete crowd.socket_clients_[socket_client.user.username]
            socket_client.disconnect()
        })




        // socket_client.on("contact list", function () {

        //     Chat.find({ $or: [{ contact1: socket_client.user.username}, { contact2: socket_client.user.username}] }).exec().then(function(chats){
        //         if(chats){
        //             let data = {}

        //             // Formatting the data render
        //             chats.forEach(function(chat){
        //                 let contact;
        //                 if(socket_client.user.username == chat.contact1){
        //                     contact = chat.contact2
        //                 }else{
        //                     contact = chat.contact1
        //                 }
        //                 data[contact]= {
        //                     contact: contact,
        //                     history: chat.history
        //                 }
        //             })
                    
        //             // render the data
        //             socket_client.emit("contact list", data )
        //         }
        //     }).catch(function(err){
        //         console.log(err);   
        //     })

        //     // User.findOne({username: socket_client.user.username}).populate("discussionsId").exec().then(function(user){
        //     //     if(user){
        //     //         console.log(user)
        //     //         console.log(user.discussionId)
        //     //     }
        //     // })
            
        // })
        
    });
}