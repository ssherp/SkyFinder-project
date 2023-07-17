var map = L.map('map').setView([0, 0], 3);

var lmark;
var myIcon = L.icon({
    iconUrl: './assets/image/astronaut.png',
    iconSize: [60, 60]

});
//Creates map element onto the page
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'

}).addTo(map);
// Changes the marker's location everytime the ISS coordinates update
var updateMarker = function (newLat, newLng) {


    lmark.setLatLng([newLat, newLng]);
    map.panTo([newLat, newLng], animate = true);
}

var latCord;
var lonCord;

var requestIssUrl = 'https://api.wheretheiss.at/v1/satellites/25544';
function issFetch() {

    fetch(requestIssUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var satCords = document.querySelector(".cords");
            latCord = Number(data.latitude);
            lonCord = Number(data.longitude);
            satCords.textContent = "Latitude: " + latCord + " / Longitude: " + lonCord;
            var locLat = document.querySelector('#lat')
            var locLon = document.querySelector('#lon')
            locLat.textContent = latCord.toFixed(2);
            locLon.textContent = lonCord.toFixed(2);
            console.log(latCord, lonCord)

            if (!lmark) {
                lmark = L.marker([latCord, lonCord], { icon: myIcon }).addTo(map)
            }
            if (cityLat && cityLon && latCord && lonCord) {
                distanceCalc();
            }
            //distanceCalc();
            updateMarker(latCord, lonCord)
            sunRise(latCord, lonCord)
        })
}

issFetch();


setInterval(function () { $(".time").text(dayjs().format("MMM DD YYYY  H:mm:ss")) },
    1000);
setInterval(issFetch, 5000)

// function getCity(){ //add search info city 

var cityLat;
var cityLon;


var cityInput = document.querySelector('#user-city');
var cityFormEl = document.querySelector('.city-form');

var citySubmit = function (event) {

    event.preventDefault();
    var city = cityInput.value.trim();
    cityInput.value = "";
    if (city) {
        console.log(city);
        getCity(city);
    }
};


cityFormEl.addEventListener('submit', citySubmit);

var getCity = function (city) {
    var geoRequest = "https://www.mapquestapi.com/geocoding/v1/address?key=xA9mxXLhrWpVTjmbArNX6dzhxdpac5jF&location=" + city + "&outFormat=json"
    fetch(geoRequest)
        .then(function (response) {

            return response.json()
        })
        .then(function (data) {
            console.log(data)
            cityLat = data.results[0].locations[0].displayLatLng.lat;
            cityLon = data.results[0].locations[0].displayLatLng.lng;

            //  cityLocation(cityLat,cityLon)



        })
}
function sunRise(latCord, lonCord) {


    var sunRequest = "https://api.sunrise-sunset.org/json?lat=" + latCord + "&lng=" + lonCord + "&date=today"
    fetch(sunRequest)
        .then(function (response) {


            return response.json()
        })
        .then(function (data) {
            console.log(data)
            var issRise = document.querySelector(".sun-rise")
            var issSet = document.querySelector(".sun-set")


            issRise.textContent = data.results.sunrise;
            issSet.textContent = data.results.sunset;
        })
}

var haversine = function (lat1, lon1, lat2, lon2) {
    var radius = 6371; //kilometers
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lon2 *= Math.PI / 180;

    var lonDif = (lon2 - lon1) / 2;
    var latDif = (lat2 - lat1) / 2;
    var abd = (Math.sin(latDif)) ** 2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(lonDif)) ** 2
    var distance = 2 * radius * Math.asin(Math.sqrt(abd));
    return distance
}
//Calculates the distance between the ISS and the user's input
var distanceCalc = function () {
    var distance = haversine(latCord, lonCord, cityLat, cityLon);
    document.querySelector('#distance').textContent = distance.toFixed(2)
    console.log(distance);
}
