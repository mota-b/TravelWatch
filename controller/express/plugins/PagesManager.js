/**
 * Module dependencies.
 */

module.exports = {

    // restriction redirect
    // restriction : function(req, res, next){

    //     let links = [
    //         "https://use.fontawesome.com/releases/v5.7.0/css/all.css", // Font Awesome
    //         "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/css/bootstrap.min.css", // Bootstrap Core
    //         "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.1/css/mdb.min.css", // Material Design Bootstrap 
    //         "/css/preLoaderStyle.css", // Navbar Style
    //     ],
    //     scripts = [
    //         "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js", // jQuery
    //         "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js", // Bootstrap tooltips
    //         "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/js/bootstrap.min.js", // Bootstrap Core
    //         "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.1/js/mdb.min.js", // Material Design Bootstrap JS 
    //         "/js/preLoaderScript.js", // Navbar Script
    //     ]
        

    //     res.render('preLoaderView', { 
    //         title: 'preLoader', 
    //         links: links,
    //         scripts: scripts,

    //         page: "dont know"
    //     });
    // },

    // return css and js
    style_and_scripts:  function (page) {
        let links = [
            "https://use.fontawesome.com/releases/v5.7.0/css/all.css", // Font Awesome
            "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/css/bootstrap.min.css", // Bootstrap Core
            "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.1/css/mdb.min.css", // Material Design Bootstrap 
            "/css/navBarStyle.css", // Navbar Style
        ],
        scripts = [
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js", // jQuery
            "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js", // Bootstrap tooltips
            "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/js/bootstrap.min.js", // Bootstrap Core
            "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.1/js/mdb.min.js", // Material Design Bootstrap JS 
            "/js/navBarScript.js", // Navbar Script
        ]
        
        
        switch (page) {
            case 'index':
                links.push("/css/"+page+"Style.css")
                scripts.push("/js/"+page+"Script.js")
            break;
            
            case 'login':
                links.push("/css/"+page+"Style.css")
                scripts.push("/js/"+page+"Script.js")
            break;
            
            case 'admin':
                links.push("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css")    
                links.push("/bower/jsoneditor/dist/jsoneditor.min.css")
                links.push("/css/"+page+"Style.css")
    
                scripts.push("https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js")
                scripts.push("/bower/jsoneditor/dist/jsoneditor.min.js")
                scripts.push("/js/"+page+"Script.js")
                
            break;
            
            case 'company':
                links.push("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css") 
                links.push("/bower/jsoneditor/dist/jsoneditor.min.css")   
                links.push("/css/"+page+"Style.css")
                
                scripts.push("https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js")
                scripts.push("/bower/jsoneditor/dist/jsoneditor.min.js")
                scripts.push("/js/"+page+"Script.js")
            break;
    
    
            default:
            break;
        }
    
        return {links, scripts}
    }
}