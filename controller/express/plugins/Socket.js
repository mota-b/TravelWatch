
// Socket Server Manager
var ssm = require("./SocketServerManager")
// Models 
var User = require("../model/userModel")
var Chat = require("../model/chatModel")





// Chat socket
module.exports = function (chat) {

    // Clear the Socket cash on server load/reload
    ssm.reload(chat);

    // Crowd Socket authentification middleware 
    chat.use((client, next) => { 
        
        //console.log("the use middle ware");
        

        // Check and authentify the client
        if(ssm.is_user(client)){

            //LOG console.log("the user is valid");
    
            // Initialise the clients socket list
            if( !chat["clients_"] ){
                chat["clients_"] = {}
            }

            //LOG console.log("there is a global list BEFORE");
            //LOG console.log(crowd.clients_);

            // The list existe ==>
            // Add curent client to global list if doesn't exist in it already
            let username = client.user.username;
                

            // Check if the user exist in the global namespace list 
            //    && Check if the user has anready an old socket bound to the server
            if (chat.clients_[username] && chat.sockets[client.user.socket_id]){
                // close old socket by id of user
                // swap curent socket id of same user
                old_socket = ssm.get_scoket(chat, username);
                old_socket.disconnect()
                chat.clients_[username].socket_id = client.id

            }else{
                // The user has no preview socket bound
                chat.clients_[username] = client.user;       
            }

            next();
            
        }else{
            // Not a valid client ==> disconnect his socket
            console.log("Invalid user from socket ==> disconnected");
            client.disconnect()
        }
         
        
        
    })
  
    // On Socket connect event
    chat.on('connection', function(client){
        
        
        // TODO GET ALL DISCUSSIONS of the client ==> then emit it
        

        // Wellcome to the Chat socket
        console.log("\n<< ", client.user.username, ' >> of ID: ', client.id, ' is connected to ',client.nsp.name);
        
        // Clients of the namespace
        console.log("\nClients of the namespace ",client.nsp.name, ": {" );
        Object.keys(chat.clients_).forEach(function(key) {
            console.log("\t* ", key, " ==> socket_ID: ", chat.clients_[key].socket_id)
        });
        console.log("}");

        // On contact list event 
        client.on("contact list", function () {

            Chat.find({ $or: [{ contact1: client.user.username}, { contact2: client.user.username}] }).exec().then(function(chats){
                if(chats){
                    let data = {}

                    // Formatting the data render
                    chats.forEach(function(chat){
                        let contact;
                        if(client.user.username == chat.contact1){
                            contact = chat.contact2
                        }else{
                            contact = chat.contact1
                        }
                        data[contact]= {
                            contact: contact,
                            history: chat.history
                        }
                    })
                    
                    // render the data
                    client.emit("contact list", data )
                }
            }).catch(function(err){
                console.log(err);   
            })

            // User.findOne({username: client.user.username}).populate("discussionsId").exec().then(function(user){
            //     if(user){
            //         console.log(user)
            //         console.log(user.discussionId)
            //     }
            // })
            
        })
        
        
        // On chat message event ==> when a user send a message to an other
        client.on("chat message", function(data){
            
            // TODO notify client new message on connection :: database notification :: to be checked on connection 
            let from = data.sender,
                to = data.to,
                room = ssm.get_roomName({from:from, to:to})
                console.log("room: ", room);
                
            // Check legible Request ==> Prevent ID Spoofing
            if(client.user.username != from){
                // SPOOFER SPOTTED                
                let Spoofer_addr = client.handshake.address
                console.log("Spoofing Identity attemp ")
                console.log("Spoofer: address "+Spoofer_addr)
                console.log("ID Spoofed: "+from)
                console.log("Destination : "+to)
                console.log("Content: "+data.msg)

                client.disconnect()
            }else{
                // NOT a SPOOFER 

                // Check if the target is online
                let target_socket = ssm.get_socket(chat, to);
                if(target_socket){
                    console.log("The chatters ar both connected")

                    // Check if client is inside the room
                    if(chat.adapter.rooms[room] && chat.adapter.rooms[room].sockets[target_socket.id]){
                        // Client is inside room
                        console.log(from, " is connected in the room") 
                    }else{
                        // Client is not inside the room
                        console.log(from, " is joining ", room)
                        client.join(room); 
                    }

                    // Check if is inside room
                    if(chat.adapter.rooms[room] && chat.adapter.rooms[room].sockets[target_socket.id]){
                        // Target inside room
                        console.log(to, " is connected in the room") 
                    }else{
                        // Target not inside room
                        console.log(to, " is joining ", room)
                        target_socket.join(room); 
                    }
                    
                    // Sending the data to the room 
                    chat.to(room).emit("chat message", data)

                    // Saving message to database
                    ssm.newMessage(client.user, room, data)

                    
                }else{
                    // Someone is missing in the room
                    console.log("Someone is missing ")

                    // notify not here 
                    client.emit("contact offline")

                    // Saving message to database
                    ssm.newMessage(client.user, room, data)
                }
            }

        })

        // On Client Disconnect event
        client.on("disconnect", function () {
            console.log("good by ", "<< ",client.user.username," >> of ID: ", client.id," from ", client.nsp.name )

            // Clients of the namespace
            console.log("\nClients of the namespace ",client.nsp.name, ": {" );
            Object.keys(chat.clients_).forEach(function(key) {
                console.log("\t* ", key)
            });
            console.log("}");
            
            delete client.user
        })

        // On deliberate quit client event
        client.on("quit", function () {
            console.log("A quit from ", client.user.username);
            
            delete chat.clients_[client.user.username]
            client.disconnect()
        })
    });
}