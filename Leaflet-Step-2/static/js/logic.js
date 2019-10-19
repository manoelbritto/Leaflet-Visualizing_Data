function getColor(d) {
  if (d >= 0 && d < 1) return "#00FF00";
  else if (d >= 1 && d < 2) return "#ADFF2F";
  else if (d >= 2 && d < 3) return "#DAA520";
  else if (d >= 4 && d < 5) return "#FF6347";
  else if (d >= 5) return "#FF4500";
  return "#FED976";
}

//legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

  //  generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i]) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

// Adding tile layer
var satellite = L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  }
);

var grayscale = L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }
);

var outdoors = L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  }
);

// setting mapStyle object
var mapStyle = {
  color: "orange",
  weight: 1.5
};

// Grabbing GeoJSON data..
var link =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var link2 = "static/data/PB2002_boundaries.json";

var tect_plates;
var earthquake = [];
d3.json(link2, function(data) {
  // Creating a geoJSON layer with the retrieved data
  tect_plates = L.geoJson(data, {
    // Passing in our style object
    style: mapStyle
  });
});

d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createCircleEarthQuake(data, tect_plates);
});

function createCircleEarthQuake(data, tect_plates) {
  for (var i = 0; i < data.features.length; i++) {
    var latitude = data.features[i].geometry.coordinates[1];
    var longitude = data.features[i].geometry.coordinates[0];
    var location = [latitude, longitude];
    earthquake.push(
      L.circle(location, {
        fillOpacity: 0.75,
        color: "transparent",
        fillColor: getColor(data.features[i].properties.mag),
        // Adjust radius
        radius: data.features[i].properties.mag * 40000
      }).bindPopup(
        "<h1>Earthquake: " +
          data.features[i].properties.mag +
          "</h1> <hr> <h3>Location: </h3>" +
          "<h4>Latitude: " +
          latitude +
          "<p>Longitude: " +
          longitude +
          "</h3>"
      )
    );
  }
  // console.log(data);

  //// join all values to create different layers
  // Create a baseMaps object
  var baseMaps = {
    Satellite: satellite,
    Grayscale: grayscale,
    Outdoors: outdoors
  };
  var earthquake2 = L.layerGroup(earthquake);
  // Create an overlay object
  var overlayMaps = {
    "Fault Lines": tect_plates,
    Earthquakes: earthquake2
  };

  // Define a map object
  var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3,
    layers: [grayscale, earthquake2]
  });
  legend.addTo(myMap);
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false
    })
    .addTo(myMap);
}
