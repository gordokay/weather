const cityView = document.querySelector('.city');
const weatherView = document.querySelector('.weather');
const temperatureView = document.querySelector('.temperature');

const apiKey = '50c34d5284bdca366cf10f6db1b9612f';

async function getLatLon(city, state, country) {
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}${state ? `,${state}` : ''}${country ? `,${country}` : ''}&appid=${apiKey}`);
  const data = await response.json();
  return {
    'lat': data[0].lat,
    'lon': data[0].lon
  };
}

async function getWeather(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
  const data = await response.json();
  return {
    'city': data.name,
    'weather': data.weather[0].main,
    'temperature': data.main.temp
  }
}

getLatLon('bicester', null, 'GB')
.then(coordinates => getWeather(coordinates.lat, coordinates.lon))
.then(weather => console.log(weather));