let HomeIcon = L.Icon.extend({
    options: {
        // shadowUrl: 'leaf-shadow.png',
        // shadowSize:   [50, 64], // shadow size
        // shadowAnchor: [4, 62], // shadow location start
        
        iconSize:     [35, 41], // icon size
        iconAnchor:   [17, 41], // icon [margin-left, margin-top] => each png need it's own repoint 
        // popupAnchor:  [6, 6]
        className: "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive custom-location-home-icon"
    }
}),
EntityIcon = L.Icon.extend({
    options: {
        // shadowUrl: 'leaf-shadow.png',
        // shadowSize:   [50, 64], // shadow size
        // shadowAnchor: [4, 62], // shadow location start
        
        iconSize:     [35, 41], // icon size
        iconAnchor:   [17, 41], // icon [margin-left, margin-top] => each png need it's own repoint 
        // popupAnchor:  [6, 6]
        className: "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive custom-location-entity-icon"
    }
});




let mm = {

    // Map creation
    createmap: function (map_id, center, zoom){
        let mymap = L.map(map_id).setView(center, zoom);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibW91a2h0YXIiLCJhIjoiY2o5cHdlOXo3NTNneDMzcHlrZDFnOXBoZSJ9.8jEQud_83lrwdz5tomQ_jw'
        }).addTo(mymap);
        return mymap    
    },

    // Add markers
    add_marker : function(map_obj, location, name){

        //Create the marker
        let marker = new L.marker(location,
            {
                title: name,
            }
        ).addTo(map_obj.map);
        
        //Set marker events
        // marker.on('drag', function(e){
        //     arcs.forEach(function(arc){
        //         let arc_name = arc.name.split("/");
        //         let index = arc_name.indexOf(marker.options.title);
            
        //         if ( index == 0 )
        //             arc.line.setLatLngs([marker._latlng, arc.line._latlngs[1]]);
        //         else
        //             if ( index == 1 )
        //                 arc.line.setLatLngs([arc.line._latlngs[0], marker._latlng]); 
        //     });
        // });
        // marker.on('remove', function(e){
        //     for (let i = arcs.length-1; i >= 0; i--) {
        //         let arc_name = arcs[i].name.split("/");
        //         let index = arc_name.indexOf(marker.options.title);
        //         if ( index != -1 ){
        //             marker.unbindPopup()
        //             map.removeLayer(arcs[i].line);
        //             arcs.splice(i, 1);
        //         }
        //     }       
        // });


        //Bind popup to the marker 
        var popup = L.popup()
        .setLatLng(marker._latlng)
        .setContent('<p>'+ marker.options.title +'</p>');
        marker.bindPopup(popup)

        //Add ref to the markers list
        map_obj.markers.push(marker);
    },
    add_marker_home : function(map_obj, location, name){
        var icon = new HomeIcon({iconUrl: '/img/home_location.png'});

        //Create the marker
        let marker = new L.marker(location,
            {
                title: name,
                icon: icon
            }
        ).addTo(map_obj.map);
        
        //Set marker events
        // marker.on('drag', function(e){
        //     arcs.forEach(function(arc){
        //         let arc_name = arc.name.split("/");
        //         let index = arc_name.indexOf(marker.options.title);
            
        //         if ( index == 0 )
        //             arc.line.setLatLngs([marker._latlng, arc.line._latlngs[1]]);
        //         else
        //             if ( index == 1 )
        //                 arc.line.setLatLngs([arc.line._latlngs[0], marker._latlng]); 
        //     });
        // });
        // marker.on('remove', function(e){
        //     for (let i = arcs.length-1; i >= 0; i--) {
        //         let arc_name = arcs[i].name.split("/");
        //         let index = arc_name.indexOf(marker.options.title);
        //         if ( index != -1 ){
        //             marker.unbindPopup()
        //             map.removeLayer(arcs[i].line);
        //             arcs.splice(i, 1);
        //         }
        //     }       
        // });


        //Bind popup to the marker 
        var popup = L.popup()
        .setLatLng(marker._latlng)
        .setContent('<p>'+ marker.options.title +'</p>');
        marker.bindPopup(popup)

        //Add ref to the markers list
        map_obj.markers.push(marker);
    },
    add_marker_entity : function(map_obj, location, name){
        var icon = new EntityIcon({iconUrl: '/img/taxi_location-gone.png'});

        //Create the marker
        let marker = new L.marker(location,
            {
                title: name,
                icon: icon
            }
        ).addTo(map_obj.map);
        
        //Set marker events
        // marker.on('drag', function(e){
        //     arcs.forEach(function(arc){
        //         let arc_name = arc.name.split("/");
        //         let index = arc_name.indexOf(marker.options.title);
            
        //         if ( index == 0 )
        //             arc.line.setLatLngs([marker._latlng, arc.line._latlngs[1]]);
        //         else
        //             if ( index == 1 )
        //                 arc.line.setLatLngs([arc.line._latlngs[0], marker._latlng]); 
        //     });
        // });
        // marker.on('remove', function(e){
        //     for (let i = arcs.length-1; i >= 0; i--) {
        //         let arc_name = arcs[i].name.split("/");
        //         let index = arc_name.indexOf(marker.options.title);
        //         if ( index != -1 ){
        //             marker.unbindPopup()
        //             map.removeLayer(arcs[i].line);
        //             arcs.splice(i, 1);
        //         }
        //     }       
        // });


        //Bind popup to the marker 
        var popup = L.popup()
        .setLatLng(marker._latlng)
        .setContent('<p>'+ marker.options.title +'</p>');
        marker.bindPopup(popup)

        //Add ref to the markers list
        map_obj.markers.push(marker);
    },
    // Update Icon
    update_marker_icon: (marker, img) => {
        marker.setIcon(
            // EntityIcon.extend({
            //     options: {
            //         iconUrl: img
            //     }
            // })
            new EntityIcon({iconUrl: img})
        ).update();
    },
    // Update marker
    update_marker: (marker, new_location) =>{
        marker.setLatLng(new_location).update()
    },
    // Get marker by title
    get_marker: (markers, title)=> {
        let index = 0;
        // console.log(markers);
        
        

        // LOOP While
        // (not finished with the list of markers)
        //    AND 
        // (The icon title is differenr from the title given)    
        while(index< markers.length && markers[index].options.title.split("\n")[0] != title){
            // console.log(markers[index].options.title.split("\n"));
            index++
        }

        if(index<markers.length){
            return markers[index];
        }else{
             return null;
        }
      
        
    },
    // Delete a marker
    dell_marker: function(map, marker, markers, arcs){
        map.removeLayer(marker);
        markers.splice(markers.indexOf(marker), 1);
    },
    // Add an arc
    add_arc: function(map, arcs, m1, m2){ 
        let arc = new L.polyline([m1._latlng, m2._latlng]).addTo(map);
        arcs.push({
            "name": m1.options.title + "/" + m2.options.title,
            "line": arc
        })
    },
    // Delete arc
    dell_arc: function(map, arc){
        map.removeLayer(arc.line);
        arcs.splice(arcs.indexOf(arc), 1);
    },
    // Set dragable (All)
    set_all_dragable: function(markers, bool){
        if (bool)
            markers.forEach(function (marker) { marker.dragging.enable()});
        else
            markers.forEach(function (marker) {marker.dragging.disable()});
    },
    // Set dragable (One)
    set_dragable: function(marker, bool){
        
        if (bool &&  !marker.dragging.enabled())
            marker.dragging.enable()
        else
            if (!bool &&  marker.dragging.enabled())
                marker.dragging.disable()
    },
    // Overwatch
    over_watch: function(map, markers){
        if (markers && markers.length>0){
            bounds = [];
            markers.forEach(function(marker) {
                bounds.push(marker._latlng)
            });
            map.flyToBounds(bounds, {})
        }
    },

    // Fly to 
    fly_to: function(map, marker, zoomLvl){
        if (marker)
            map.flyTo(marker._latlng, zoomLvl)
    }

}//Map manager



/**
 * Map init
 */
// map= mm.createmap("main-map",[35.705839, -0.631704], 13)
// markers= []
// arcs= []
