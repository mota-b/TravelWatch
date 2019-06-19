
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
        console.log(admin.ui_data.username+" is connected");
        $(".navbar-nav").append(
            "   <li class='nav-item dropdown active '>"

            +"      <a class='nav-link btn-outline-warning waves-effect dropdown-toggle' id='dropDown_admin' data-toggle='dropdown' aria-haspopup='true' -->"
            +"          "+admin.ui_data.username
            +"      </a>"
            +"      <div id='admin-menu' class='dropdown-menu dropdown-menu-right dropdown-info' aria-labelledby='dropDown_admin'>"
            +"          <a class='dropdown-item' href='/admin'>Admin</a>"
            +"          <a class='dropdown-item' href='/logout/admin'>Log out</a>"
            +"      </div> "
            
            +"  </li>" 
        )
    }


    // user ui if loged
    if(user){
        console.log(user.ui_data.username+" is connected");
        
        $("#log_link").html("")
        
        
        // apend standard user list-item
        let user_nav = "   <li class='nav-item dropdown active '>"
                        +"       <a class='nav-link dropdown-toggle' id='dropDown_user' data-toggle='dropdown' aria-haspopup='true' -->"
                        +"          <i class='fas fa-user'></i> "+user.ui_data.username
                        +"      </a>"
                        +"      <div id='user-menu' class='dropdown-menu dropdown-menu-right dropdown-info ' aria-labelledby='dropDown_user'>"
         
        // apend spesific user list-items
        switch(user.type){
            case "c_manager":
                user_nav = user_nav 
                +"          <a class='dropdown-item' href='/company/manage'>Manage</a>"
                // +"          <a class='dropdown-item' href='/company/profile'>Profile</a>"  
            break;

            case "operator":
                user_nav = user_nav
                +"          <a class='dropdown-item' href='/company/overwatch'>Overwatch</a>"
            break;
            
            case "mate":
                user_nav = user_nav
                +"          <a class='dropdown-item' href='/mate/index'>Profile</a>"
            break;
        }
        

        // apend standard logout list-item
        user_nav = user_nav 
            +"          <a class='dropdown-item' href='/logout'>Log out</a>"
            +"      </div> "

            +"  </li>" 
        
        // display the ui user nav
        $("#log_link").html(
                user_nav
        )

    }

}