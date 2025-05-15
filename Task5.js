const apiKey = 'd3c0878b2f0ea1c7978a3874985ea166';
const cityInput = document.getElementById('cityInput');
const searchBtn  = document.getElementById('searchBtn');
const locBtn     = document.getElementById('locBtn');
const errorMsg   = document.getElementById('errorMsg');
const weatherEl  = document.getElementById('weatherDisplay');
const locationEl = document.getElementById('location');
const iconEl     = document.getElementById('icon');
const descEl     = document.getElementById('description');
const tempEl     = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl     = document.getElementById('wind');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

locBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      err => showError('Unable to retrieve location.')
    );
  } else {
    showError('Geolocation is not supported by your browser.');
  }
});

function fetchWeatherByCity(city) {
  clearDisplay();
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => handleWeatherResponse(data))
    .catch(() => showError('Network error.'));
}

function fetchWeatherByCoords(lat, lon) {
  clearDisplay();
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => handleWeatherResponse(data))
    .catch(() => showError('Network error.'));
}

function handleWeatherResponse(data) {
  if (data.cod !== 200) {
    return showError(data.message || 'Location not found.');
  }
  errorMsg.classList.add('hidden');
  weatherEl.classList.remove('hidden');
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  iconEl.src         = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  descEl.textContent = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
  tempEl.textContent = data.main.temp.toFixed(1);
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed.toFixed(1);
}

function showError(message) {
  weatherEl.classList.add('hidden');
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

function clearDisplay() {
  errorMsg.classList.add('hidden');
  weatherEl.classList.add('hidden');
}
