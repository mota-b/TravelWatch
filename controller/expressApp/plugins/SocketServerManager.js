// Models
let mongoose = require("mongoose")
let Operator = require("../../../model/OperatorModel"),
    Entity = require("../../../model/EntityOfInterestModel"),
    Location = require("../../../model/LocationModel");
    

 

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
    is_user : (socket_client) => {

        
        
        let token = socket_client.handshake.query.token
        
        // Check token exist
        if(token){
            
            // verify the token
            let decode = Operator.verifyJWT(token) 
                
            // Check user existance from the decoded token
            if (decode.user){
                
                
                // bind user data to his socket
                socket_client["user"] = decode.user
                socket_client["user"].socket_id = socket_client.id  
                socket_client["user"].isOnline = true  
            
                return true;
            }else{
                // Not a valid token
                return false
            }
            
        }else {
            // No token found
            return false
            
        }
    
    },

    // Check the entity Of interest in the handshake
    is_entityOfInterest :  (socket_client) => {

        // console.log("attempt socket entity");
      
        let data = socket_client.handshake.query.data;
        let parsed_date;
        let parsed_token;

        if (socket_client.handshake.query.data) {
            parsed_date =  JSON.parse(data)
            parsed_token = parsed_date.token
        }
        
      
        let token = parsed_token || socket_client.handshake.headers.token
      
        // verify the token
        let decode = Entity.verifyJWT(token) 
       
        
        // console.log(decode);
        
        if (decode) {
            // Check user existance from the decoded token
            if (decode.entity_name){
                    
                decode.username = decode.entity_name
                // bind user data to his socket
                socket_client["user"] = decode
                socket_client["user"].socket_id = socket_client.id  
                socket_client["user"].isOnline = true  
            
                return true;
            }else{
                // Not a valid token
                return false
            }    
        }else{
            return false
        }
        


        return false;
        // Check token exist
        // if(_id){
            
        //     // verify the token
        //     // let decode = Operator.verifyJWT(token) 
            
        //     // Check user existance from the token "_id"
        //     Entity.findById(_id).exec( (err, entity) =>{
        //         if(entity){
        //             // console.log(entity);
        //             // console.log(entity._id);
                    
        //             let userEntity = {
        //                 username: entity.entity_name,
        //                 entity_name: entity.entity_name,
        //                 entity_type: entity.entity_type,
        //                 entity_mac: entity.entity_mac,
                        
        //                 c_manager: entity.c_manager,
        //                 operator: entity.operator
                        
        //             }
                
                    
        //             // bind user data to his socket
        //             socket_client["user"] = userEntity
        //             socket_client["user"].socket_id = socket_client.id  
        //             socket_client["user"].isOnline = true  
        //     console.log(socket_client["user"]);
            
        //             // console.log(socket_client);
                    
        //             return true;   
        //         }else{
        //             // Not a valid token
        //             return false
        //         }
        //     }) 
        //     return true;
            
            
        
            
            
            
        // }else {
        //     // No token found
        //     return false;
        // }

    },

   
    // Return socket id of a socket_client from namespace socket_clients list
    get_scoketID: (namespace_socket, username) => {

        // Check if the user is inside the namespace socket_clients list
        if(namespace_socket.socket_clients_[username]){
            return namespace_socket.socket_clients_[username].id
        }else{
            return null
        }
    },
    
    // Return Socket from it's user_name
    get_socketByName: (namespace_socket, username) => {

        
        
        let sockets = namespace_socket.sockets
        //console.log("avant display")
        //console.log(namespace_socket.name)
        
        // socket_clients of the namespace
        // console.log("\nchecking *****!!! Sockets of the namespace ",namespace_socket.name, ": {" );
        // Object.keys(sockets).forEach(function(key) {
        //     console.log("\t* ", key, " ==> socket of user : ", sockets[key].user.username)
        // });
        // console.log("}");

        //console.log(namespace_socket.socket_clients_[username].socket_id)
        //console.log(sockets[namespace_socket.socket_clients_[username].socket_id])
        // Check if the socket of the socket_client is inside the namespace
        //console.log(sockets[namespace_socket.socket_clients_[username].socket_id])
        if(namespace_socket.socket_clients_[username] && sockets[namespace_socket.socket_clients_[username].socket_id]){
            return sockets[namespace_socket.socket_clients_[username].socket_id]
        }else{
            return null;
        }
    },
    // Return Socket from it's user_id
    get_socketByID: (namespace_socket, target_id) => {
        

        let sockets = namespace_socket.sockets,
            target_socket = null;

            // GOAL THE SOCKET ID of the target console.log(sockets[AN_ID]);
        Object.keys(namespace_socket.socket_clients_).forEach(function(key) {
            if(namespace_socket.socket_clients_[key]._id == target_id){
                // console.log(namespace_socket.socket_clients_[key]);
                target_socket = sockets[namespace_socket.socket_clients_[key].socket_id]

            }

        });
        
        return target_socket
        
        //console.log("avant display")
        //console.log(namespace_socket.name)
        
        // socket_clients of the namespace
        // console.log("\nchecking *****!!! Sockets of the namespace ",namespace_socket.name, ": {" );
        // Object.keys(sockets).forEach(function(key) {
        //     console.log("\t* ", key, " ==> socket of user : ", sockets[key].user.username)
        // });
        // console.log("}");

        //console.log(namespace_socket.socket_clients_[username].socket_id)
        //console.log(sockets[namespace_socket.socket_clients_[username].socket_id])
        // Check if the socket of the socket_client is inside the namespace
        //console.log(sockets[namespace_socket.socket_clients_[username].socket_id])
        // if(namespace_socket.socket_clients_[username] && sockets[namespace_socket.socket_clients_[username].socket_id]){
        //     return sockets[namespace_socket.socket_clients_[username].socket_id]
        // }else{
        //     return null;
        // }
    },

    // Get the Unic name of the room (left-right/right-left) in case of 2 peers connection
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
    },

    // Chat responce 
    newLocation: (user, room_name, data) => {
        
        let from = data.sender,
                to = data.to,
                room = room_name
        console.log("data");
        console.log(data);
        // console.log("user");
        // console.log(user);

        
        // Create the New lecation
        Entity.findById(user._id, (err, entity) => {
            if (entity){

                let newLocation = new Location({
                    entity_id: user._id,
                    provider: data.provider,
                    date: data.date,
                    lat_lon: {
                        lat: data.lat_lon[0],
                        lng: data.lat_lon[1]
                    },
                    accuracy: data.accuracy,
                    altitude: data.altitude,
                    asimuth: data.asimuth,
                    speed: data.speed,
                    time: data.time,
                    satellites: data.curent_satellites
                })
            
            
                // Save the document (new Creation)
                newLocation.save()
        

                // Bind the new  location to the Entity
                entity.location_history.push(newLocation._id)
                entity.save()

                    
            }
        })
    }

}