const cityView = document.querySelector('.city');
const iconView = document.querySelector('.icon');
const weatherView = document.querySelector('.weather');
const temperatureView = document.querySelector('.temperature');
const forecastErrorView = document.querySelector('.forecast > .error');

const form = document.querySelector('form');
const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const countryInput = document.getElementById('country');
const formErrorView = document.querySelector('.form > .error');

const apiKey = '50c34d5284bdca366cf10f6db1b9612f';

form.addEventListener('submit', submitForm);

async function getLatLon(city, state, country) {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}${state ? `,${state}` : ''}${country ? `,${country}` : ''}&appid=${apiKey}`);
    const data = await response.json();
    formErrorView.textContent = '';
    return {
      'lat': data[0].lat,
      'lon': data[0].lon
    };
  } catch (err) {
    formErrorView.textContent = err;
  }
}

async function getWeather(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
    const data = await response.json();
    forecastErrorView.textContent = '';
    return {
      'city': data.name,
      'icon': data.weather[0].icon,
      'weather': data.weather[0].main,
      'temperature': data.main.temp
    }
  } catch (err) {
    forecastErrorView.textContent = err;
  }
}

function updateView(weather) {
  cityView.textContent = weather.city;
  iconView.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  iconView.alt = `${weather.weather} icon`;
  weatherView.textContent = weather.weather;
  temperatureView.textContent = weather.temperature;
}

function submitForm(e) {
  e.preventDefault();
  getLatLon(cityInput.value, stateInput.value, countryInput.value)
  .then(coordinates => getWeather(coordinates.lat, coordinates.lon))
  .then(weather => updateView(weather))
  .then(() => clearForm())
  .catch(err => console.log(err));
}

function clearForm() {
  cityInput.value = '';
  stateInput.value = '';
  countryInput.value = '';
}