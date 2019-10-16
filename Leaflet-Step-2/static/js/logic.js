// Creating map object
var map = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 3
});

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
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }
).addTo(map);

// geojson for when data.beta.nyc is down
var link =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  //   //   L.geoJson(data, { style: style }).addTo(map);
  for (var i = 0; i < data.features.length; i++) {
    var latitude = data.features[i].geometry.coordinates[1];
    var longitude = data.features[i].geometry.coordinates[0];
    var location = [latitude, longitude];
    L.circle(location, {
      fillOpacity: 0.75,
      color: "transparent",
      fillColor: getColor(data.features[i].properties.mag),
      // Adjust radius
      radius: data.features[i].properties.mag * 40000
    })
      .bindPopup(
        "<h1>Earthquake: " +
          data.features[i].properties.mag +
          "</h1> <hr> <h3>Location: </h3>" +
          "<h4>Latitude: " +
          latitude +
          "<p>Longitude: " +
          longitude +
          "</h3>"
      )
      .addTo(map);
  }
  console.log(data);
});

legend.addTo(map);

var link = "static/data/PB2002_boundaries.json";

// Our style object
var mapStyle = {
  color: "orange",
  weight: 1.5
};

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Passing in our style object
    style: mapStyle
  }).addTo(map);
});
