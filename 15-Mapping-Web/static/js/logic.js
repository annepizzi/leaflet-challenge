  // Create the base layers.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap]
  });

  streetmap.addTo(myMap);

  let earthquakes = new L.LayerGroup();

  let overlayMaps = {
  Earthquakes: earthquakes
  };

  // Create a layer control.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function(data) {
  function marker(feature) {
    return {
        radius: Radius(feature.properties.mag),
        fillColor: colorPick(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      }
// use switch statement to determine which color goes with each marker
    function colorPick(depth) {
      switch (true) {
        case depth > 6:
          return 'rgb(245, 86, 0)';
        case depth > 5:
          return 'rgb(242, 136, 29)';
        case depth > 4:
          return 'rgb(237, 223, 24)';
        case depth > 3:
          return 'rgb(229, 245, 0)';
        case depth > 2:
          return 'rgb(180, 245, 0)';
        case depth > 1:
          return "rgb(131, 245, 0)"
        case depth > 0:
            return "rgb(131, 245, 0)";
      }
    }
// define the radius
  function Radius(mag) {
        if (mag === 0) {
          return 1;
        }
        return mag * 2;
      }

// add to map now and return as a circle marker
L.geoJSON(data, {
  pointToLayer: function(feature, latlng){
    return L.circleMarker(latlng);
  },
  style: marker,
  onEachFeature: function(feature, layer){
    layer.bindPopup("<h3>Location: " + feature.properties.place +
      "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
}).addTo(earthquakes);

earthquakes.addTo(myMap);


});
// add the legend used https://www.igismap.com/legend-in-leafletjs-map-with-topojson/ for reference to make a legend

function getColor(d) {
    return d < 1 ? 'rgb(131, 245, 0)' :
          d < 2  ? 'rgb(131, 245, 0)' :
          d < 3  ? 'rgb(180, 245, 0)' :
          d < 4  ? 'rgb(229, 245, 0)' :
          d < 5  ? 'rgb(237, 223, 24)' :
          d < 6  ? 'rgb(242, 136, 29)' :
          d < 7  ? 'rgb(245, 86, 0)':
                   'rgb(255,0,0)';
}

var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      grades = [ 1, 2, 3, 4, 5, 6],
      labels = [];

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
  };

  legend.addTo(myMap);
