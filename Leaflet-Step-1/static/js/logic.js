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

  //   switch (d) {
  //     case d >= 0 && d < 1:
  //       return "#00FF00";

  //     case d >= 1 && d < 2:
  //       return "#ADFF2F";

  //     case d >= 2 && d < 3:
  //       return "#FFA500";

  //     case d >= 3 && d < 4:
  //       return "#DAA520";

  //     case d >= 4 && d < 5:
  //       return "#FF6347";

  //     case d >= 5:
  //       return "#FF4500";

  //     default:
  //       return "#FED976";
  //   }
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

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.5,
        weight: 1.5
      };
    }
  }).addTo(map);
  console.log(data);
});

legend.addTo(map);
