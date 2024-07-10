document.addEventListener('DOMContentLoaded', function() {
    fetchRecentCities();
    document.getElementById('get-weather-btn').addEventListener('click', getWeather);
});

let animation;

function getWeather() {
    const city = document.getElementById('city').value;
    const weatherInfo = document.getElementById('weather-info');
    
    if (city) {
        fetch(`/weather?city=${city}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.weather && data.main) {
                    const weather = data.weather[0].description.toLowerCase();
                    const temp = data.main.temp;
                    weatherInfo.innerHTML = `<div class="weather-details">
                                                 <h2>Weather in ${city}</h2>
                                                 <p>${weather}</p>
                                                 <p>Temperature: ${temp} °C</p>
                                              </div>`;
                    updateBackground(weather);
                } else {
                    weatherInfo.innerHTML = `<p>Invalid data received from the weather API.</p>`;
                }
                fetchRecentCities();
            })
            .catch(error => {
                weatherInfo.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
                console.error('Fetch error:', error);
            });
    } else {
        weatherInfo.innerHTML = `<p>Please enter a city name.</p>`;
    }
}

function fetchRecentCities() {
    fetch('/recent-cities')
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('recent-cities');
            dataList.innerHTML = '';
            data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.cityName;
                dataList.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching recent cities:', error);
        });
}

function updateBackground(weather) {
    const container = document.getElementById('animation-container');
    const body = document.body;
    
    if (animation) {
        animation.destroy();
    }

    container.innerHTML = ''; // Clear previous animation

    if (weather.includes("rain")) {
        body.style.backgroundImage = "url('rainy.jpg')";
        animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'rain.json' // Path to your Lottie animation file
        });
    } else if (weather.includes("cloud")) {
        body.style.backgroundImage = "url('cloudy.jpg')";
        animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'clouds.json' // Path to your Lottie animation file
        });
    } else if (weather.includes("clear")) {
        body.style.backgroundImage = "url('clear.jpg')";
        container.innerHTML = ''; // Remove animation
    } else if (weather.includes("snow")) {
        body.style.backgroundImage = "url('snowy.jpg')";
        animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'snow.json' // Path to your Lottie animation file
        });
    } else {
        body.style.backgroundImage = "url('default.jpg')";
        container.innerHTML = ''; // Remove animation
    }
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}
