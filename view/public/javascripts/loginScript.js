
// Main
$(document).ready(function(){  

    // SignUp and LogIn forms 
    forms_config()
    
})


// SignUp and LogIn forms 
forms_config = () => {
    /* Slide section */
    $("#b_sign,#b_log").click(function(event){
        if(event.currentTarget.id=="b_sign" && $("#area-1").css("display")=="none" ){
            $("#area-2").slideToggle("slow")
            $("#area-1").slideToggle("slow")
        }
        if(event.currentTarget.id=="b_log" && $("#area-2").css("display")=="none"){
            $("#area-1").slideToggle("slow")        
            $("#area-2").slideToggle("slow")
        }
    })

    /* LogIn-SignUp requests */
    $("#register").submit(function(event){
        event.preventDefault();
        $.ajax( {
            url:'/api/login/reg',
            type:"POST",
            data:{
                "username": $(this).find("input[name=username]").val(),
                "email": $(this).find("input[name=email]").val(),
                "password": $(this).find("input[name=password]").val()
            },
            
            success: function(data) {    
                if (data.error){ 
                    alert(data.error.message)
                }
                else{
                    window.location.href = data.redirect;
                }
            }  
        });

        return false;
    });
    $("#log").submit(function(event){
        event.preventDefault();
        $.ajax( {
            url:'/api/login/log',
            type:"POST",
            data:{
                "strat_number": 0, // TODO choose strategie number 
                "username": $(this).find("input[name=username]").val(),
                "password": $(this).find("input[name=password]").val(),
                "remember": $("input[name=remember]")[0].checked,
            },
            
            success: function(data) { 
                
                if (data.error){ 
                    alert(data.error.message)
                }
                else{
                    
                    if(data.remember=="true"){
                        
                        localStorage.setItem("user", JSON.stringify(data))
                    }else{
                        
                        sessionStorage.setItem("user", JSON.stringify(data))
                    }
                    
                    window.location.href = "/";
                }
            },
            
        });
        return false;
    });
}