
const apiKey = 'f5c1bf41c82742b680a45d8db1403602';
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/';


async function fetchWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) return alert('Please enter a city name');

    try {
        
        const weatherResponse = await fetch(`${apiBaseUrl}weather?q=${city}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();
        displayCurrentWeather(weatherData);

        
        const forecastResponse = await fetch(`${apiBaseUrl}forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        displayHourlyForecast(forecastData);

       
        const { coord } = weatherData;
        const nearbyResponse = await fetch(`${apiBaseUrl}find?lat=${coord.lat}&lon=${coord.lon}&cnt=5&units=metric&appid=${apiKey}`);
        const nearbyData = await nearbyResponse.json();
        displayNearbyCities(nearbyData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to retrieve weather data. Please try again later.');
    }
}


function displayCurrentWeather(data) {
    const todayWeatherDiv = document.getElementById('today-weather');
    todayWeatherDiv.innerHTML = `
        <div class="weather-info">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" />
            </div>
            <div class="temperature">
                <span>${Math.round(data.main.temp)}°C</span>
                <p>Real Feel ${Math.round(data.main.feels_like)}°C</p>
            </div>
            <div class="details">
                <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
                <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
                <p>Duration: ${calculateDayDuration(data.sys.sunrise, data.sys.sunset)}</p>
            </div>
        </div>
    `;
}


function displayHourlyForecast(data) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '<h2>Hourly</h2><div class="hourly-info"></div>';
    
    const hourlyInfoDiv = hourlyForecastDiv.querySelector('.hourly-info');
    for (let i = 0; i < 5; i++) {
        const hourData = data.list[i];
        const hour = new Date(hourData.dt * 1000).getHours();
        const hourDisplay = hour > 12 ? `${hour - 12}pm` : `${hour}am`;
        
        hourlyInfoDiv.innerHTML += `
            <div class="hour">
                <p>${hourDisplay}</p>
                <img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" alt="${hourData.weather[0].description}" />
                <p>${Math.round(hourData.main.temp)}°C</p>
            </div>
        `;
    }
}

// Function to display nearby cities
function displayNearbyCities(data) {
    const nearbyCitiesDiv = document.getElementById('nearby-cities');
    nearbyCitiesDiv.innerHTML = '<h2>Nearby Places</h2><div class="nearby-cities-info"></div>';
    
    const nearbyCitiesInfoDiv = nearbyCitiesDiv.querySelector('.nearby-cities-info');
    data.list.forEach(city => {
        nearbyCitiesInfoDiv.innerHTML += `
            <div class="city">
                <p>${city.name}</p>
                <img src="https://openweathermap.org/img/wn/${city.weather[0].icon}.png" alt="${city.weather[0].description}" />
                <p>${Math.round(city.main.temp)}°C</p>
            </div>
        `;
    });
}

// Helper function to calculate day duration
function calculateDayDuration(sunrise, sunset) {
    const duration = sunset - sunrise;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

// Function to switch tabs
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}
