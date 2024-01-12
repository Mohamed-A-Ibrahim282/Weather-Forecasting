var searchInput = document.querySelector(".search");
var searchInputValue;
var locationList = [];
var currentList = [];
var dateList = [];
var dayName;
var date = new Date();
var n = date.toDateString();

async function search() {
    var searchTearm = await fetch(`http://api.weatherapi.com/v1/search.json?key=d9ae8376b8364a86bf9201813233112&q=${searchInput.value}`);
    var searchArray = await searchTearm.json();
    if (searchArray.length == 0) {
        searchInputValue = searchInputValue
    }
    else {
        searchInputValue = searchArray[0].name
    }

    Weather(`${searchInputValue}`)

}

searchInput.addEventListener("input", function () {
    if (searchInput.value.length >= 3) {
        search()
    }
})

navigator.geolocation.getCurrentPosition((pos) => {
    var loc1 = pos.coords.latitude;
    var loc2 = pos.coords.longitude;
    Weather(`${loc1}  ${loc2}`)
});

async function Weather(Term) {
    var days = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=d9ae8376b8364a86bf9201813233112&q=${Term}&days=3`);

    var allDays = await days.json();

    locationList = allDays.location
    currentList = allDays.current
    dateList = allDays.forecast.forecastday
    display();
}

function display() {
    var icon1 = currentList.condition.icon;
    getTheDay(dateList[0].date);

    var cartoona = `<div class="col-lg-4 col-md-6">
        <div class="item pb-4 rounded-3">
            <div class="d-flex justify-content-between bg-black px-4 py-2 text-white rounded-top-3">
                <p class="mb-0 fw-bold">${dayName}</p>
                <p class="mb-0 fw-bold">${n}</p>
            </div>
            <div class="mt-4 px-4 text-center">
                <h5 class = "fst-italic fw-bold display-6">${locationList.name}, ${locationList.country}</h5>
                <div class="my-3">
                <img src = "https:${icon1}" class = "col-3" />
                    <h2 class="fs-3 fw-bold">${currentList.temp_c}<sup>o</sup>C</h2>
                </div>
                <h6 class = "text-white fw-bold">${currentList.condition.text}</h6>
            </div>
            <div class="w-100 d-flex justify-content-around px-4 mt-4">
                <div class="d-flex align-items-center me-3">
                <i class="fa-solid fa-cloud me-1"></i>
                    <p class="mb-0">${currentList.cloud}</p>
                </div>
                <div class="d-flex align-items-center me-3">
                    <i class="fa-solid fa-wind me-1"></i>
                    <p class="mb-0">${currentList.wind_kph} km/h</p>
                </div>
                <div class="d-flex align-items-center me-3">
                <i class="fa-regular fa-compass me-1"></i>
                    <p class="mb-0">${currentList.wind_dir}</p>
                </div>
            </div>
        </div>
    </div>`

    for (let i = 1; i < dateList.length; i++) {
        getTheDay(dateList[i].date);
        var icon = dateList[i].day.condition.icon;

        cartoona += `<div class="col-lg-4 col-md-6 text-center">
        <div class="item pb-4 rounded-3">
            <div class="bg-black d-flex justify-content-center px-4 py-2 text-white rounded-top-3">
                <p class="mb-0 fw-bold">${dayName}</p>
            </div>
            <div class="mt-4 px-4">
                <div class="py-2 my-4">
                    <img src = "https:${icon}" class = "col-3" />
                    <h5 class="fs-4 fw-bold mt-5 mb-2">${dateList[i].day.maxtemp_c}<sup>o</sup>C</h5>
                    <h6 class="fs-6 fw-bold">${dateList[i].day.mintemp_c}<sup>o</sup>c</h6>
                </div>
                <h6 class = "text-white fw-bold">${dateList[i].day.condition.text}</h6>
            </div>
        </div>
    </div>`
    }
    document.querySelector(".row").innerHTML = cartoona;
}


function getTheDay(thedate) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(thedate);
    dayName = days[d.getDay()];
}