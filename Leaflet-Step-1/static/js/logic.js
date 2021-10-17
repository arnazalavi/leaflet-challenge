// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// var myMap;
// var geoLayer

// // Perform a GET request to the query URL
// // get data
// d3.json(queryUrl).then(function(data) {
//   console.log(data.features);
//   // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
//   //geoLayer = L.geoJSON=(data.features).addTo(myMap)
//   geoLayer = L.geoJSON(data.features);
//   createEarthquakesMap(geoLayer);

// });
// // geometry point gives you the point marker /plygon
// // Define streetmap and darkmap layers
// //For each 
// //Notes

// //geoLayer.geometry.type= "point";
// // for (var i = 0; i < geoLayer.length; i++) {
// //var Lat = geoLayer.geometry.coordinates[1];
// //var Lag = geoLayer.geometry.coordinates[0];

// function createEarthquakesMap(geoLayerData){

// var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// });

// var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/dark-v10",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//   };

// // Create a new map
//  var myMap = L.map("map", {
//    center: [
//     37.09, -95.71
//    ],
//   zoom: 5,
//   layers: [streetmap]
//   });

//   //geoLayer.geometry.type= "point";
// // for (var i = 0; i < geoLayer.length; i++) {
// //var Lat = geoLayer.geometry.coordinates[1];
// //var Lag = geoLayer.geometry.coordinates[0];
// //L.marker (Lat, Lang).addTo(myMap)
// }

// Store our API endpoint as queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

  function getColor(depth) {
      if (depth > 20 ) {
          return "red"
      }
     else { 
         return "green"
     }
  }
// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  var geoLayer = L.geoJSON(data.features,
    {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          `<h2>${feature.properties.place}</h2><hr>Magnitude: ${feature.properties.mag}`
        );
      },
      pointToLayer:function(feature,latlon){
          return L.circleMarker(latlon)
      },
      style: function(feature) {
          return {
              fillColor:getColor(feature.geometry.coordinates[2]),
              radius:feature.properties.mag*4,
              weight:0.5,
              color:"black"
          }
      }
    }
  );

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: geoLayer
  };

  // Create a new map
  myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, geoLayer]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

});