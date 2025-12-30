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
