
// =============================================
// 01 DEFINE FUNCTIONS
// =============================================

// A. CONVERTS JS TIME FORMAT TO ISO FORMAT FOR API CALLS

    function isodate(date) {

        var dd = date.getDate();
        var mm = date.getMonth()+1; 
        var yyyy = date.getFullYear();
        if(dd<10) 
        {
            dd='0'+dd;
        } 
        
        if(mm<10) 
        {
            mm='0'+mm;
        } 
        date = yyyy+'-'+mm+'-'+dd;

        return date;
    };    

// B. MARKER SIZE
  function markerSize(mag) {
    return (mag**5)*120;  // scale for log (mag**10) but take the square root since circle area = pi*r**2 = mag**5
  }

// C. MARKER COLOR
  function markerColor(mag) {
    if (mag<1) {         
      return "lightyellow";
    }
    else if (mag<2) {
      return "gold";
    }
    else if (mag<3) {
      return "orange";
    }
    else if (mag<4) {
      return "orangered";
    }
    else if (mag<5) {
      return "tomato";
    }
    else if (mag<6) {
      return "crimson"; 
    }
    else if (mag>=6) {
      return "maroon"; 
    }
  }



// ===============================================
// 02 Map Layer
//================================================

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -119.71],
  zoom: 4
});

// Add Background tile 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);


// =============================================
// 02 QUERY API and Add Circles for each map location
// =============================================

//A. GET START AND END DATE IN ISO FORMAT 

    var today = new Date();
    var end = isodate(today);
    var startdate = new Date(Date.now()-14*24*60*60*1000);
    var start = isodate(startdate); 



//B.  QUERY URL - WITH UPDATED START AND END ITMES
    // URL to pull the last 2 weeks of earthquake information
    var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime="+ start +"&endtime=" + end ;

//C. Query URL and use call functions to produce map
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    data.features.forEach(function(earthquake){
      var location = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]] ;
      //console.log(location);
      
      L.circle(location, {
        fillOpacity: 0.75,
        fillColor: markerColor(earthquake.properties.mag),
        color:  markerColor(earthquake.properties.mag),
        radius: markerSize(earthquake.properties.mag) 
      }).bindPopup("<h3> Magnitude: " + earthquake.properties.mag +
      "</h3><hr><p>Time: " + new Date(earthquake.properties.time) + "</p>" + 
      "</h3><hr><p>Place: " + earthquake.properties.place+"</p>")
      .addTo(myMap);

    });   

  }); 
