const apiKey = "5232bfb800bfbf9758276650b2e1a1f9"; // <-- Replace with your OpenWeatherMap key

// HTML elements
const weatherCity = document.getElementById("weather-city");
const weatherTemp = document.getElementById("weather-temp");
const otherCities = {
  "Chattogram": document.getElementById("ctg"),
  "Sylhet": document.getElementById("syl"),
  "Rajshahi": document.getElementById("raj"),
  "Rangpur": document.getElementById("ran"),
  "Barishal": document.getElementById("bar")
};

// Fetch weather for a city
async function fetchWeather(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},BD&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    if (data && data.main && data.main.temp != null) {
      return Math.round(data.main.temp); // Celsius
    }
    return "--";
  } catch (err) {
    console.error("Error fetching weather for", cityName, err);
    return "--";
  }
}

// Set current location weather
function setUserLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();
        weatherCity.textContent = data.name || "Dhaka";
        weatherTemp.textContent = data.main ? Math.round(data.main.temp) + "°C" : "--°C";
      } catch {
        const temp = await fetchWeather("Dhaka");
        weatherCity.textContent = "Dhaka";
        weatherTemp.textContent = temp + "°C";
      }
    }, async () => {
      const temp = await fetchWeather("Dhaka");
      weatherCity.textContent = "Dhaka";
      weatherTemp.textContent = temp + "°C";
    });
  } else {
    const temp = await fetchWeather("Dhaka");
    weatherCity.textContent = "Dhaka";
    weatherTemp.textContent = temp + "°C";
  }
}

// Set other cities weather
async function setOtherCitiesWeather() {
  for (const city in otherCities) {
    const temp = await fetchWeather(city);
    otherCities[city].textContent = `${city}: ${temp}°C`;
  }
}

// Initialize
setUserLocationWeather();
setOtherCitiesWeather();

// Optional: refresh every 10 minutes
setInterval(() => {
  setUserLocationWeather();
  setOtherCitiesWeather();
}, 600000);
