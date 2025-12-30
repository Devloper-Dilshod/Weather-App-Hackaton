
        const API_KEY = '940702a307b0d1ca0eb2ae684c9384f8';
        let unit = 'metric'; 
        let lastCity = "Toshkent";

        const THEME_MAP = {
            'Clear': 'bg-clear',
            'Clouds': 'bg-clouds',
            'Rain': 'bg-rain',
            'Drizzle': 'bg-rain',
            'Thunderstorm': 'bg-rain',
            'Snow': 'bg-snow',
            'Mist': 'bg-clouds',
            'Smoke': 'bg-clouds',
            'Haze': 'bg-clouds',
            'Fog': 'bg-clouds'
        };

        const ICON_MAP = {
            'Clear': 'fa-sun',
            'Clouds': 'fa-cloud',
            'Rain': 'fa-cloud-showers-heavy',
            'Drizzle': 'fa-cloud-rain',
            'Thunderstorm': 'fa-bolt',
            'Snow': 'fa-snowflake',
            'Atmosphere': 'fa-smog'
        };

        window.addEventListener('load', () => {
            initLocation();
        });

        function initLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        updateWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
                    },
                    () => updateWeatherByName("Toshkent")
                );
            } else {
                updateWeatherByName("Toshkent");
            }
        }

        async function handleSearch() {
            const query = document.getElementById('citySearch').value.trim();
            if (!query) return;
            updateWeatherByName(query);
        }

        async function updateWeatherByName(cityName) {
            toggleUI(true);
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}&lang=uz`);
                const data = await res.json();
                
                if (data.cod === 200) {
                    lastCity = data.name;
                    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}&lang=uz`);
                    const forecastData = await forecastRes.json();
                    renderUI(data, forecastData);
                } else {
                    showError("Shahar topilmadi.");
                }
            } catch (err) {
                showError("Tarmoq xatosi yuz berdi.");
            }
        }

        async function updateWeatherByCoords(lat, lon) {
            toggleUI(true);
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=uz`);
                const data = await res.json();
                
                const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=uz`);
                const forecastData = await forecastRes.json();
                
                lastCity = data.name;
                renderUI(data, forecastData);
            } catch (err) {
                showError("Joylashuv bo'yicha ma'lumot olib bo'lmadi.");
            }
        }

        function renderUI(current, forecast) {
            toggleUI(false);
            
            const mainWeather = current.weather[0].main;
            const themeClass = THEME_MAP[mainWeather] || 'bg-default';
            const iconClass = ICON_MAP[mainWeather] || 'fa-cloud';

  
            document.getElementById('displayCity').innerText = current.name;
            document.getElementById('displayDate').innerText = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' });
            document.getElementById('displayTemp').innerText = `${Math.round(current.main.temp)}°`;
            document.getElementById('displayCondition').innerText = current.weather[0].description;
            document.getElementById('displayRange').innerText = `Sezilarli: ${Math.round(current.main.feels_like)}°`;
            document.getElementById('displayHumidity').innerText = `${current.main.humidity}%`;
            document.getElementById('displayWind').innerText = `${current.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`;
            document.getElementById('displayPressure').innerText = current.main.pressure;
            
            document.getElementById('mainIcon').innerHTML = `<i class="fas ${iconClass}"></i>`;
            document.body.className = `${themeClass} min-h-screen flex items-center justify-center p-4 md:p-6 text-white`;

    
            const forecastContainer = document.getElementById('forecastList');
            forecastContainer.innerHTML = '';
            
            const dailyData = forecast.list.filter((f, index) => index % 8 === 0).slice(0, 5);

            dailyData.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('uz-UZ', { weekday: 'short' });
                const dayWeather = day.weather[0].main;
                const dayIcon = ICON_MAP[dayWeather] || 'fa-cloud';

                forecastContainer.innerHTML += `
                    <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span class="w-12 font-bold uppercase text-white/80">${dayName}</span>
                        <div class="flex items-center gap-3 flex-1 px-4">
                            <i class="fas ${dayIcon} text-xl text-white/90"></i>
                            <span class="text-xs text-white/50 hidden md:block capitalize">${day.weather[0].description}</span>
                        </div>
                        <div class="flex gap-3 font-mono">
                            <span class="font-bold">${Math.round(day.main.temp_max)}°</span>
                            <span class="opacity-40 text-sm">${Math.round(day.main.temp_min)}°</span>
                        </div>
                    </div>
                `;
            });
        }

        function toggleUI(isLoading) {
            document.getElementById('loadingState').classList.toggle('hidden', !isLoading);
            document.getElementById('mainDashboard').classList.toggle('hidden', isLoading);
            document.getElementById('errorBox').classList.add('hidden');
        }

        function showError(msg) {
            toggleUI(false);
            document.getElementById('mainDashboard').classList.add('hidden');
            document.getElementById('errorBox').classList.remove('hidden');
            document.getElementById('errorMessage').innerText = msg;
        }


        document.getElementById('toggleUnit').addEventListener('click', function() {
            unit = unit === 'metric' ? 'imperial' : 'metric';
            this.innerText = unit === 'metric' ? '°C' : '°F';
            updateWeatherByName(lastCity);
        });

        document.getElementById('citySearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
});