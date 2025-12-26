const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name').querySelector('span');
const temp = document.getElementById('temp').querySelector('span');
const condition = document.getElementById('condition').querySelector('span');
const humidity = document.getElementById('humidity').querySelector('span');
const wind = document.getElementById('wind').querySelector('span');
const errorMsg = document.getElementById('error-msg');
const weatherBackground = document.getElementById('weather-background');
const weatherIcon = document.getElementById('weather-icon');
const suggestionsDiv = document.getElementById('suggestions');

// Weather API Key (Replace with your actual API key)
const apiKey = '04ab9ba15df6422fb6d200938252612';

// Event listener for live search (location input)
locationInput.addEventListener('input', async () => {
  const query = locationInput.value.trim();

  if (query.length >= 2) {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
      const data = await response.json();

      // Clear previous suggestions
      suggestionsDiv.innerHTML = '';

      if (data.length > 0) {
        suggestionsDiv.style.display = 'block';
        
        // Populate suggestions
        data.forEach(location => {
          const suggestionItem = document.createElement('div');
          suggestionItem.classList.add('suggestion-item');
          suggestionItem.textContent = `${location.name}, ${location.country}`;
          
          suggestionItem.addEventListener('click', () => {
            locationInput.value = `${location.name}, ${location.country}`;
            suggestionsDiv.style.display = 'none';
            getWeather(`${location.name}, ${location.country}`);
          });
          
          suggestionsDiv.appendChild(suggestionItem);
        });
      } else {
        suggestionsDiv.style.display = 'none';
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  } else {
    suggestionsDiv.style.display = 'none';
  }
});

// Fetch weather data from the API
async function getWeather(location) {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`);
    const data = await response.json();

    if (data.error) {
      errorMsg.textContent = `Error: ${data.error.message}`;
      weatherInfo.style.display = 'none';
    } else {
      weatherInfo.style.display = 'block';
      errorMsg.textContent = '';

      cityName.textContent = data.location.name;
      temp.textContent = data.current.temp_c;
      condition.textContent = data.current.condition.text;
      humidity.textContent = data.current.humidity;
      wind.textContent = data.current.wind_kph;

      // Set weather background and icon
      updateBackground(data.current.condition.text);
      weatherIcon.innerHTML = `<img src="https:${data.current.condition.icon}" alt="weather-icon">`;
    }
  } catch (error) {
    errorMsg.textContent = 'Failed to fetch weather data.';
    weatherInfo.style.display = 'none';
  }
}

// Update background and apply animations based on weather condition
function updateBackground(condition) {
  if (condition.toLowerCase().includes('sunny')) {
    weatherBackground.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?sunny')";
    clearAnimations();
  } else if (condition.toLowerCase().includes('cloudy')) {
    weatherBackground.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?cloudy')";
    addCloudAnimation();
  } else if (condition.toLowerCase().includes('rain')) {
    weatherBackground.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?rain')";
    addRainAnimation();
  } else if (condition.toLowerCase().includes('wind')) {
    weatherBackground.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?wind')";
    addWindAnimation();
  } else {
    weatherBackground.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?default')";
  }
}

// Clear existing weather animations
function clearAnimations() {
  weatherBackground.classList.remove('cloud-animation', 'wind-animation', 'rain-animation');
}

// Add cloud animation effect
function addCloudAnimation() {
  weatherBackground.classList.add('cloud-animation');
}

// Add rain animation effect
function addRainAnimation() {
  weatherBackground.classList.add('rain-animation');
}

// Add wind animation effect
function addWindAnimation() {
  weatherBackground.classList.add('wind-animation');
}

// Event listener for Search button (when user clicks "Search")
searchBtn.addEventListener('click', () => {
  const location = locationInput.value.trim();
  if (location) {
    getWeather(location);
  } else {
    errorMsg.textContent = 'Please enter a valid location.';
    weatherInfo.style.display = 'none';
  }
});
