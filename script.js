let currentTemp = null;
let isCelsius = true;

function weather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else {
        alert("Geolocation ishlamayabdi.");
    }
}

function showWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '940702a307b0d1ca0eb2ae684c9384f8';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=uz`;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const humidity = data.current_weather.humidity;
            const wind = data.current_weather.windspeed;
            const weathercode = data.current_weather.weathercode;

            document.getElementById("desc").innerText = 
                `Harorat: ${temp}°C\nShamol: ${wind} km/h\nWeather code: ${weathercode} `;
        })
        .catch(err => console.error(err));
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '940702a307b0d1ca0eb2ae684c9384f8';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;  
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
}

function showError(error) {
    alert("Error getting location: " + error.message);
}

function toggleUnit() {
    if (currentTempC === null) return; // Ma’lumot yo‘q bo‘lsa hech narsa qilmasin
    isCelsius = !isCelsius;
    updateTempDisplay();
}

function updateTempDisplay() {
    const tempElement = document.getElementById("temp");
    if (isCelsius) {
        tempElement.innerText = `${currentTempC} °C`;
    } else {
        const tempF = (currentTempC * 9/5 + 32).toFixed(2);
        tempElement.innerText = `${tempF} °F`;
    }
}

function showError(error) {
    alert("Joylashuvni olishda xato yuz berdi: " + error.message);
}