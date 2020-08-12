// Variables storing the Earthquake & Tectonic Plates GEOJSON URls for querying
var URL_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var URL_earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Initiating LayerGroups to hold Earthquakes and Techtonic Plates
var earthquake_layer = new L.LayerGroup();
var techtonicplates_layer = new L.LayerGroup();

// Defining Variable for storing lightMap TileLayer
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
maxZoom: 18,
id: "mapbox/streets-v11",
accessToken: API_KEY
});
// Defining Variable for storing darkMap TileLayer
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});
// Defining Variable for storing grayScale TileLayer
var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

// Defining Variable to store Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquake_layer,
    "Fault Lines": techtonicplates_layer
};

// Defining Variable to store base layers
var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": lightMap
};

/* Creating map and passing the darkMap and earthquake_layer as initial load
layers */
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satelliteMap, earthquake_layer]
});

/* Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer
Control to the Map */
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Harnessing D3 to call and retrieve earthquake data
d3.json(URL_earthquakes, function(earthquakeDataset) {

// Function to calculate the size of the marker, using the earthquak magnitude
  function markerSize(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 3;
  }

/* Function with case arguement that determines how the marker is stylised
based on the magnitude of the earthquake */
  function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: colorChoice(feature.properties.mag),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
  }

/* Function with case arguement that determines the colour of earthquake marker
based on the magnitude of the earthquake */
  function colorChoice(magnitude) {
      switch (true) {
      case magnitude > 5:
          return "#f06b6b";
      case magnitude > 4:
          return "#f0a76b";
      case magnitude > 3:
          return "#f3db4d";
      case magnitude > 2:
          return "#e1f34d";
      case magnitude > 1:
          return "#b7f34d";
      default:
          return "#DAF7A6";
      }
  }

/* Initializing a GeoJSON layer, that contains the features array on the
earthquakeDataset */
  L.geoJSON(earthquakeDataset, {
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: styleInfo,

/* Function to give each feature a pop-up window, describing the details of
the corresponding earthquake */
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h4>Location: " + feature.properties.place +
          "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) +
          "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
      }

// Adds the earthquakeDataset to the earthquakes LayerGroup
  }).addTo(earthquake_layer);
  // Add earthquakes Layer to the Map
  earthquake_layer.addTo(myMap);

  // Harnessing D3 to call and retrieve techtonic URL_plates
  d3.json(URL_plates, function(plateData) {
      // Create a GeoJSON Layer the plateData
      L.geoJson(plateData, {
          color: "#DC143C",
          weight: 2
      // Adding techtonic plates data to tectonicPlates LayerGroups
      }).addTo(techtonicplates_layer);
      // Add tectonicPlates Layer to the Map
      techtonicplates_layer.addTo(myMap);
  });

  // Set Up Legend
  var chartLegend = L.control({ position: "bottomright" });
  chartLegend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      magnitudeLevels = [0, 1, 2, 3, 4, 5];

      div.innerHTML += "<h3>Magnitude</h3>"

      for (var i = 0; i < magnitudeLevels.length; i++) {
          div.innerHTML +=
              '<i style="background: ' + colorChoice(magnitudeLevels[i] + 1) + '"></i> ' +
              magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
      }
      return div;
  };
  chartLegend.addTo(myMap);
});
