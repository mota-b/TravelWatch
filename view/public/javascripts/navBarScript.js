
// Main
$(document).ready(function(){
    function verifySession(){
        
        if(localStorage.getItem("user")){
            user = JSON.parse(localStorage.getItem("user"))
        }else{
            user = JSON.parse(sessionStorage.getItem("user")) 
        }
        
        
        
        if(user){
            $(".navbar-nav.ml-auto").html("")
            
            $(".navbar-nav.ml-auto").html(
                "<li class='nav-item active'>"
                    +"<a class='nav-link' href='/'>"
                    +"Home"
                    +"<span class='sr-only'>(current)</span>"
                    +"</a>"
                +"</li>"

                // +"<li class='nav-item'>"
                //     +"<a class='nav-link' href='#'>"
                //     +"<i class='fab fa-instagram'></i> Instagram</a>"
                // +"</li>" 

                +"<li class='nav-item dropdown'>"
                +"  <a class='nav-link dropdown-toggle' id='navbarDropdownMenuLink-4' data-toggle='dropdown' aria-haspopup='true' -->"
                +"      <i class='fas fa-user'></i> "+user.ui_data.username
                +"  </a>"
                +"  <div id='user-menu' class='dropdown-menu dropdown-menu-right dropdown-info' aria-labelledby='navbarDropdownMenuLink-4'>"
                +"   <a class='dropdown-item' href='/user'>Profile</a>"
                +"   <a class='dropdown-item' href='/logout'>Log out</a>"
                +"  </div> "
                +"</li>"
            )

            if(user.ui_data.isAdmin){    
                $("#user-menu").prepend(
                    $("<a>").attr({
                        class:"dropdown-item",
                        href:"/admin"
                    }).html("Admin")
                )
            }
        }
    }
    verifySession()
    
})