
// Main
$(document).ready(function(){
    function verifySession(){
        let user = sessionStorage.getItem("user")
        if(user){
            console.log(user);
        }else{
            console.log(user);
        }
    }
    verifySession()
    
})