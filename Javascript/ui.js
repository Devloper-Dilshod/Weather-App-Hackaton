function renderUI(current, forecast) {
    toggleUI(false);
    
    const mainWeather = current.weather[0].main;
    const themeClass = THEME_MAP[mainWeather] || "bg-default";
    const iconClass = ICON_MAP[mainWeather] || "fa-cloud";
    
    document.getElementById("displayCity").innerText = current.name;
    document.getElementById("displayDate").innerText =
    new Date().toLocaleDateString("uz-UZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    document.getElementById("displayTemp").innerText = `${Math.round(
    current.main.temp
)}°`;
    document.getElementById("displayCondition").innerText =
    current.weather[0].description;
    document.getElementById("displayRange").innerText = `Sezilarli: ${Math.round(
    current.main.feels_like
)}°`;
    document.getElementById(
        "displayHumidity"
    ).innerText = `${current.main.humidity}%`;
    document.getElementById("displayWind").innerText = `${current.wind.speed} ${
    unit === "metric" ? "m/s" : "mph"
}`;
    document.getElementById("displayPressure").innerText = current.main.pressure;
    
    document.getElementById(
        "mainIcon"
    ).innerHTML = `<i class="fas ${iconClass}"></i>`;
    document.body.className = `${themeClass} min-h-screen flex items-center justify-center p-4 md:p-6 text-white`;
    
    const forecastContainer = document.getElementById("forecastList");
    forecastContainer.innerHTML = "";
    
    const dailyData = forecast.list
    .filter((f, index) => index % 8 === 0)
    .slice(0, 5);
    
    dailyData.forEach((day) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("uz-UZ", { weekday: "short" });
        const dayWeather = day.weather[0].main;
        const dayIcon = ICON_MAP[dayWeather] || "fa-cloud";
        
        forecastContainer.innerHTML += `
                    <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span class="w-12 font-bold uppercase text-white/80">${dayName}</span>
                        <div class="flex items-center gap-3 flex-1 px-4">
                            <i class="fas ${dayIcon} text-xl text-white/90"></i>
                            <span class="text-xs text-white/50 hidden md:block capitalize">${
                            day.weather[0].description
                            }</span>
                        </div>
                        <div class="flex gap-3 font-mono">
                            <span class="font-bold">${Math.round(
                            day.main.temp_max
                            )}°</span>
                            <span class="opacity-40 text-sm">${Math.round(
                            day.main.temp_min
                            )}°</span>
                        </div>
                    </div>
                `;
    });
}

function toggleUI(isLoading) {
    document
    .getElementById("loadingState")
    .classList.toggle("hidden", !isLoading);
    document
    .getElementById("mainDashboard")
    .classList.toggle("hidden", isLoading);
    document.getElementById("errorBox").classList.add("hidden");
}

function showError(msg) {
    toggleUI(false);
    document.getElementById("mainDashboard").classList.add("hidden");
    document.getElementById("errorBox").classList.remove("hidden");
    document.getElementById("errorMessage").innerText = msg;
}

document.getElementById("toggleUnit").addEventListener("click", function () {
    unit = unit === "metric" ? "imperial" : "metric";
    this.innerText = unit === "metric" ? "°C" : "°F";
    updateWeatherByName(lastCity);
});

document.getElementById("citySearch").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});
