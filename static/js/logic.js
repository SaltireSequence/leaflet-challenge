var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var mapboxKey = "pk.eyJ1Ijoid2lsbGlhbXRjZm9yc3l0aCIsImEiOiJja2Q5a2d5MGQwaDd3MnhxdzA2ZmM3Z3l4In0.LyUug2qMsb3KqPH5do99yA"
var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?"
var mapboxdarkURL = "https://api.mapbox.com/styles/mapbox/dark-v10//tiles/256/{z}/{x}/{y}?"

d3.json(URL, function (data) {
    createFeatures(data.features)
});

function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "#4FFF2F"
    }
    else if (magnitude < 2) {
        return "#BAFF2F"
    }
    else if (magnitude < 3) {
        return "#FFC300"
    }
    else if (magnitude < 4) {
        return "#FF5733"
    }
    else if (magnitude < 5) {
        return "#C70039"
    }
    else if (magnitude < 6) {
        return "#900C3F"
    }
    else {
        return "#581845"
    };
};

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        var months = ['Jan','Feb','Mar','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat']
        var timestamp = new Date(feature.properties.time);
        var day = days[timestamp.getDay()];
        var month = months[timestamp.getMonth()];
        var date = timestamp.getDate();
        var hours = timestamp.getHours();
        var minutes = "0" + timestamp.getMinutes();
        var formattedTime = day + ", " + month + " " + date + " " + hours + ':' + minutes.substr(-2);
