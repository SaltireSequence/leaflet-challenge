// Variables storing the Earthquake & Tectonic Plates GEOJSON URls for querying
var URL_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var URL_earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Initiating LayerGroups to hold Earthquakes and Techtonic Plates
var earthquake_layer = new L.LayerGroup();
var techtonicplates_layer = new L.LayerGroup();

// Defining Variable for storing lightMap TileLayer
var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});
// Defining Variable for storing darkMap TileLayer
var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "mapbox.satellite",
    accessToken: API_KEY
});
// Defining Variable for storing grayScale TileLayer
var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
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
    "Satellite": darkMap,
    "Grayscale": grayscaleMap,
    "Outdoors": lightMap
};

/* Creating map and passing the darkMap and earthquake_layer as initial load
layers */
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [darkMap, earthquake_layer]
});

/* Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer
Control to the Map */
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Harnessing D3 to call and retrieve earthquake data
d3.json(earthquakesURL, function(earthquakeDataset) {

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
          return "#581845";
      case magnitude > 4:
          return "#900C3F";
      case magnitude > 3:
          return "#C70039";
      case magnitude > 2:
          return "#FF5733";
      case magnitude > 1:
          return "#FFC300";
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
