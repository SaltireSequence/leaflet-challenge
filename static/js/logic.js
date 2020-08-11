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

//
var myMap
