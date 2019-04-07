
// Main
$(document).ready(function(){
    
    // Admin and user session
    verifySession()    

    // Navigation ui
    user_nav()
})



// Admin and user session
function verifySession(){
        
    // Check the user log
    user = null;
    if(localStorage.getItem("user")){
        user = JSON.parse(localStorage.getItem("user"))
    }else{
        user = JSON.parse(sessionStorage.getItem("user")) 
    }
    
   

    // Check the admin log
    admin = null;
    if(sessionStorage.getItem("admin")){
        admin = JSON.parse(sessionStorage.getItem("admin"))
    }
    

}

// Navigation ui
function user_nav(){
    // admin ui if loged
    if(admin){
        
        $(".navbar-nav").append(
            "   <li class='nav-item dropdown active '>"
    
            +"      <a class='nav-link btn-outline-warning waves-effect' href='/admin' id='navbarDropdownMenuLink-4'>"
            +"          Admin "
            +"      </a>"
        
            +"  </li>"
        )
    }


    // user ui if loged
    if(user){
        $("#log_link").html("")
        
        $("#log_link").html(
           
            "  <a class='nav-link dropdown-toggle' id='navbarDropdownMenuLink-4' data-toggle='dropdown' aria-haspopup='true' -->"
            +"      <i class='fas fa-user'></i> "+user.ui_data.username
            +"  </a>"
            +"  <div id='user-menu' class='dropdown-menu dropdown-menu-right dropdown-info' aria-labelledby='navbarDropdownMenuLink-4'>"
            +"   <a class='dropdown-item' href='/user'>Profile</a>"
            +"   <a class='dropdown-item' href='/logout'>Log out</a>"
            +"  </div> "
            
        )

    }

}