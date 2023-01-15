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

const temperatureToggler = document.querySelector('.forecast > button');
let isFahrenheit = true;

const loader = document.querySelector('.loader');

const apiKey = '50c34d5284bdca366cf10f6db1b9612f';

form.addEventListener('submit', submitForm);
temperatureToggler.addEventListener('click', toggleTemperatureUnit);

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
    formErrorView.textContent = `'Location not found: ${err}`;
    throw err;
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
      'temperature': Math.round(data.main.temp)
    }
  } catch (err) {
    forecastErrorView.textContent = `Error getting weather data: ${err}`;
    throw err;
  }
}

function updateView(weather) {
  hideLoader();
  cityView.textContent = weather.city;
  iconView.src = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;
  iconView.alt = `${weather.weather} icon`;
  weatherView.textContent = weather.weather;
  temperatureView.textContent = weather.temperature;
  temperatureToggler.style.visibility = 'visible';
  temperatureToggler.textContent = 'switch to celcius';
  isFahrenheit = true;
}

function submitForm(e) {
  displayLoader();
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

function toggleTemperatureUnit() {
  if(isFahrenheit) {
    temperatureView.textContent = convertToCelcius(+temperatureView.textContent);
    temperatureToggler.textContent = 'switch to fahrenheit';
    isFahrenheit = false;
  } else {
    temperatureView.textContent = convertToFahrenheit(+temperatureView.textContent);
    temperatureToggler.textContent = 'switch to celcius';
    isFahrenheit = true;
  }
} 

function convertToCelcius(temp) {
  return Math.round((temp - 32) * (5/9));
}

function convertToFahrenheit(temp) {
  return Math.round((temp * (9/5)) + 32);
}

function displayLoader() {
  loader.classList.add('visible');
}

function hideLoader() {
  loader.classList.remove('visible');
}