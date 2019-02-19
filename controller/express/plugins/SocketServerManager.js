// Models
var User = require("../model/userModel")
var Chat = require("../model/chatModel")
var mongoose = require("mongoose")

module.exports = {

    //Reload the socket ==> in case of server crash or restart
    reload: (namespace_socket) => {
        let sockets = namespace_socket.sockets.sockets
        
        // Check if there is connected socket on server load/reload 
        if (sockets){
            Object.keys(sockets).forEach(function(socket_id) {
                sockets[socket_id].disconnect()
            });
        }
    },

    // Check the user authentification in the handshake
    is_user : (client) => {

        let token = client.handshake.query.token
        
        // Check token exist
        if(token){
            
            // verify the token
            let User = require("../model/userModel"),
                decode = User.verifyJWT(token) 

                // Check user existance from the decoded token
                if (decode.user){
                    
                    // bind user data to his socket
                    client["user"] = decode.user
                    client["user"].socket_id = client.id  
                    client["user"].isOnline = true  
                
                    return true;
                }else{
                    // Not a valid token
                    return false
                }
            
        }else {
            // No token found
            return false;
        }
    
    },

    // Return socket id of a client from namespace clients list
    get_scoketID: (namespace_socket, username) => {

        // Check if the user is inside the namespace clients list
        if(namespace_socket.clients_[username]){
            return namespace_socket.clients_[username].id
        }else{
            return null
        }
    },
    
    // Return Socket from it's ID
    get_socket: (namespace_socket, username) => {

        
        
        let sockets = namespace_socket.sockets
        //console.log("avant display")
        //console.log(namespace_socket.name)
        
        // Clients of the namespace
        // console.log("\nchecking *****!!! Sockets of the namespace ",namespace_socket.name, ": {" );
        // Object.keys(sockets).forEach(function(key) {
        //     console.log("\t* ", key, " ==> socket of user : ", sockets[key].user.username)
        // });
        // console.log("}");

        //console.log(namespace_socket.clients_[username].socket_id)
        //console.log(sockets[namespace_socket.clients_[username].socket_id])
        // Check if the socket of the client is inside the namespace
        //console.log(sockets[namespace_socket.clients_[username].socket_id])
        if(namespace_socket.clients_[username] && sockets[namespace_socket.clients_[username].socket_id]){
            return sockets[namespace_socket.clients_[username].socket_id]
        }else{
            return null;
        }
    },

    // Get the Unic name of the room (left-right/right-left)
    get_roomName: (data) => { if(data.from>data.to) return data.from+"-"+data.to; else return data.to+"-"+data.from;},
    
    // Chat responce 
    newMessage: (user, room_name, data) => {
        
        let from = data.sender,
                to = data.to,
                room = room_name
        console.log("data");
        console.log(data);
        
        // Create the discussion if doesnt exist
        Chat.findOneAndUpdate({room_name: room}, { $push: { history: {sender: from, msg: data.msg} } }).exec().then( function(chat_obj){
            console.log(chat_obj);
            
            if(chat_obj){

                // Check contact
                if(chat_obj.contact1 != user.username){
                    if(!chat_obj.contact2 ){
                        chat_obj.id2 = user._id
                        chat_obj.contact2 = user.username
                    }
                }
                

                // There is a chat ==> just append message to history
                console.log("Existing chat found");
                
                // Limit discussion to 100 message
                if(chat_obj.history.length>=100){
                    console.log("overflow history");
                    
                    chat_obj.history.shift()    
                }
                
                
                //chat_obj.history.push()

                chat_obj.save()
            }
            else{
                // There is no chat ==> create one, append message to history, then bind to parts
                console.log("New chat: ", room);

                // Create the chat and append the message to history
                let newChat = new Chat({
                    id1: user._id,
                    contact1: user.username,
                    contact2: to,
                    room_name: room,
                    history: [{
                        sender: from,
                        msg: data.msg  
                    }]
                })
                

                newChat.save()
            }
        }).catch(function(err){
            if(err){
               
                console.log("Dtabase problem");
                console.log(err);
                     
           
            }
        })
    }

}