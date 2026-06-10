import "./styles.css";

import clearDayIcon from "./assets/clear-day.svg";
import clearNightIcon from "./assets/clear-night.svg";
import partlyCloudyDayIcon from "./assets/partly-cloudy-day.svg";
import partlyCloudyNightIcon from "./assets/partly-cloudy-night.svg";
import cloudyIcon from "./assets/cloudy.svg";
import windIcon from "./assets/wind.svg";
import rainIcon from "./assets/rain.svg";
import snowIcon from "./assets/snow.svg";

import clearDayBackground from "./assets/clear-day-background.jpg";
import clearNightBackground from "./assets/clear-night-background.jpg";
import partlyCloudyDayBackground from "./assets/partly-cloudy-day-background.jpg";
import partlyCloudyNightBackground from "./assets/partly-cloudy-night-background.jpg";
import cloudyBackground from "./assets/cloudy-background.jpg";
import windyBackground from "./assets/windy-background.jpg";
import rainBackground from "./assets/rain-background.jpeg";
import snowBackground from "./assets/snow-background.jpg";

const iconMap = {
  clearDayIcon,
  clearNightIcon,
  partlyCloudyDayIcon,
  partlyCloudyNightIcon,
  windIcon,
  rainIcon,
  snowIcon,
  cloudyIcon
};

const apiKey = 'NUA2JQ2XKGNC9GNHM8DRPWW4T';
let location = 'argao, cebu';
let unitGroup = 'metric';
const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

const weatherData = async function fetchWeatherData() {
    try{
        
        const url = `${baseUrl}${location}?unitGroup=${unitGroup}&key=${apiKey}&contentType=json`;
        const response = await fetch(url);
        const data = await response.json();
        
        const address = await data.resolvedAddress;
        const currentConditions = await data.currentConditions;
        const days = await data.days;
        const description = await data.description;
        const timezone = await data.timezone;

        console.log("API Response:", data);
        
        console.log("Weather Data:", {
            address,
            currentConditions,
            days,
            description,
            timezone
        });
        
        return {
            address,
            currentConditions,
            days,
            description,
            timezone
        };
        
    }catch(error){
        console.error("Error fetching weather data:", error);
    }
}


const locationElement = document.querySelector('.location-name');

const iconElement = document.querySelector('.weather-icon img');
const sunriseElement = document.querySelector('.sunrise');
const sunsetElement = document.querySelector('.sunset');

const dateTimeElement = document.querySelector('.date-time');
const temperatureElement = document.querySelector('.temperature');
const feelsLikeElement = document.querySelector('.feels-like');
const weatherConditionElement = document.querySelector('.condition');
const weatherDescriptionElement = document.querySelector('.description');

const conditionsListElement = document.querySelector('.conditions-list');

const searchBar = document.getElementById('search-bar');
const searchButton = document.querySelector('.search-button');
const toggleButton = document.querySelector('.toggle-unit');

const backgroundElement = document.querySelector('.background');

async function renderWeatherData(){
    try{
        const weather = await weatherData();
        const {address, currentConditions, days, description, timezone} = weather;
        
        locationElement.textContent = address;
        // Sunset and Sunrise
        switch(currentConditions.icon){
            case 'clear-day':
                iconElement.src = clearDayIcon;
                backgroundElement.style.backgroundImage = `url(${clearDayBackground})`;
                break;
            case 'clear-night':
                iconElement.src = clearNightIcon;
                backgroundElement.style.backgroundImage = `url(${clearNightBackground})`;
                break;
            case 'partly-cloudy-day':
                iconElement.src = partlyCloudyDayIcon;
                backgroundElement.style.backgroundImage = `url(${partlyCloudyDayBackground})`;
                break;
            case 'partly-cloudy-night':
                iconElement.src = partlyCloudyNightIcon;
                backgroundElement.style.backgroundImage = `url(${partlyCloudyNightBackground})`;
                break;
            case 'cloudy':
                iconElement.src = cloudyIcon;
                backgroundElement.style.backgroundImage = `url(${cloudyBackground})`;
                break;
            case 'wind':
                iconElement.src = windIcon;
                backgroundElement.style.backgroundImage = `url(${windyBackground})`;
                break;
            case 'rain':
                iconElement.src = rainIcon;
                backgroundElement.style.backgroundImage = `url(${rainBackground})`;
                break;
            case 'snow':
                iconElement.src = snowIcon;
                backgroundElement.style.backgroundImage = `url(${snowBackground})`;
                break;
            // case 'fog':
            //     iconElement.src = fogIcon;
            //     backgroundElement.style.backgroundImage = `url(${fogBackground})`;
            //     break;
            default:
                iconElement.src = '';
        }

        sunriseElement.textContent = "Sunrise: " + (Number(currentConditions.sunrise.slice(0, 2)) < 10 ? currentConditions.sunrise.slice(1).slice(0, -3) : currentConditions.sunrise.slice(0, -3));
        sunsetElement.textContent = "Sunset: " + (Number(currentConditions.sunset.slice(0, 2)) < 10 ? currentConditions.sunset.slice(1).slice(0, -3) : currentConditions.sunset.slice(0, -3));

        // Date and Time, Temperature, Feels Like, Weather Condition, Weather Description
        const [year, month, day] = days[0].datetime.split("-");
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
        const now = new Date();
        console.log("Current Date and Time:", now.toLocaleString('en-US', { timeZone: timezone }));
        dateTimeElement.textContent = formattedDate + " | " + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone, hour12: false });
        temperatureElement.textContent = (currentConditions.temp) + (unitGroup === 'metric' ? '°C' : '°F');
        feelsLikeElement.textContent = "Feels like: " + (currentConditions.feelslike) + (unitGroup === 'metric' ? '°C' : '°F');
        weatherConditionElement.textContent = currentConditions.conditions;
        weatherDescriptionElement.textContent = description;

        console.log(currentConditions.conditions);
        console.log(description);

        // Conditions
        conditionsListElement.innerHTML = '';
        const conditions = [
            { label: 'Humidity', value: currentConditions.humidity + '%' },
            { label: 'Wind Speed', value: currentConditions.windspeed + (unitGroup === 'metric' ? ' km/h' : ' mph') },
            { label: 'Precipitation', value: currentConditions.precipprob + ("%") },
            { label: 'Visibility', value: currentConditions.visibility + (unitGroup === 'metric' ? ' km' : ' mi') },
            { label: 'UV Index', value: currentConditions.uvindex }
        ];
        
        conditions.forEach(condition => {
            const listItem = document.createElement('li');
            listItem.textContent = `${condition.label}: ${condition.value}`;
            conditionsListElement.appendChild(listItem);
        });

        const daysListElement = document.querySelector('.days-list');
        daysListElement.innerHTML = '';

        for(let i = 0; i < 7; i++){
            //date info
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            const dateInfoElement = document.createElement('div');
            dateInfoElement.classList.add('date-info');
            const minMaxElement = document.createElement('div');
            minMaxElement.classList.add('min-max');
            const conditionsElement = document.createElement('div');
            conditionsElement.classList.add('conditions');
            
            const [year, month, day] = days[i].datetime.split("-");
            const date = new Date(year, month - 1, day);
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short'}).toLocaleUpperCase();

            const dayNameElement = document.createElement('div');
            dayNameElement.classList.add('day-name');
            dayNameElement.textContent = formattedDate;

            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            dateElement.textContent = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).split(" ")[0]}`;
            
            dateInfoElement.appendChild(dayNameElement);
            dateInfoElement.appendChild(dateElement);


            //min max

            const minTempElement = document.createElement('div');
            minTempElement.classList.add('min');
            minTempElement.innerHTML = `<span>min: </span>` + Math.round(days[i].tempmin) + (unitGroup === 'metric' ? '°C' : '°F');

            const maxTempElement = document.createElement('div');
            maxTempElement.classList.add('max');
            maxTempElement.innerHTML = `<span>max: </span>` + Math.round(days[i].tempmax) + (unitGroup === 'metric' ? '°C' : '°F');
            const dayIconElement = document.createElement('img');

            minMaxElement.appendChild(minTempElement);
            minMaxElement.appendChild(maxTempElement);

            //conditions


            const newIconName = days[i].icon    
                .replace(/-([a-z])/g, (g, letter) => letter.toUpperCase()) + "Icon";

            if(iconMap[newIconName]){
                dayIconElement.src = iconMap[newIconName];
            }else {
                console.warn(`Webpack asset mapping missing for string: ${newIconName}`);
            }

            dayIconElement.alt = days[i].icon;

            conditionsElement.appendChild(dayIconElement);

            const conditionsTextElement = document.createElement('div');
            conditionsTextElement.classList.add('conditions');
            conditionsTextElement.textContent = days[i].conditions;
            conditionsElement.appendChild(conditionsTextElement);

            dayElement.appendChild(dateInfoElement);
            dayElement.appendChild(minMaxElement);
            dayElement.appendChild(conditionsElement);
            daysListElement.appendChild(dayElement);

            if(i === 0){
                dayElement.classList.add('current-day');    
            }
        }

        //section for one hour forecast
        const sectionOneHourForecast = document.querySelector('.section.three');
        sectionOneHourForecast.innerHTML = '';

        // 1. Safely parse the current numeric hour for the target timezone
        const localHourStr = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: timezone });
        let startHour = Number(localHourStr);

        // 2. Apply your conditional logic rules
        if (startHour + 8 > 23 ) {
            startHour = 16;
        }


        // Clear previous forecast elements before rendering a new location
        sectionOneHourForecast.innerHTML = '';

        // 3. Loop exactly 8 times to build the 8-hour forecast block
        for (let i = 0; i < 8; i++) {
            // This calculates the correct index (e.g., 15, 16, 17...) for the weather data array
            const actualHourIndex = startHour + i;
            const hourData = days[0].hours[actualHourIndex];

            // Safety fallback in case the index somehow rolls past midnight (24+)
            if (!hourData) break; 

            const hourElement = document.createElement('div');
            hourElement.classList.add('one-hour-forecast');

            // Display the actual calculated local time slot label (e.g., "15:00", "16:00")
            const timeSlotElement = document.createElement('div');
            timeSlotElement.classList.add('time-slot');
            timeSlotElement.textContent = `${actualHourIndex}:00`;

            // Process and assign the icon asset
            const iconElement = document.createElement('img');
            const iconName = hourData.icon.replace(/-([a-z])/g, (g, letter) => letter.toUpperCase()) + "Icon";

            if (iconMap[iconName]) {
                iconElement.src = iconMap[iconName];
            } else {
                console.warn(`Webpack asset mapping missing for string: ${iconName}`);
            }
            iconElement.alt = hourData.icon;

            // Process temperature strings
            const tempElement = document.createElement('div');
            tempElement.classList.add('temp');
            tempElement.textContent = Math.round(hourData.temp) + (unitGroup === 'metric' ? '°C' : '°F');

            // Append to DOM layout
            hourElement.appendChild(timeSlotElement);
            hourElement.appendChild(iconElement);
            hourElement.appendChild(tempElement);
            sectionOneHourForecast.appendChild(hourElement);
        }

    }catch(error){

        console.error("Error rendering weather data:", error);
    }
}


toggleButton.addEventListener('click', () => {
    if (unitGroup === 'metric') {
        toggleButton.textContent = "Show °C";
        unitGroup = 'us';
    } else {
        toggleButton.textContent = "Show °F";
        unitGroup = 'metric';
    }
    renderWeatherData();
});

searchButton.addEventListener('click', () => {
    const userInput = searchBar.value.trim();
    if (userInput) {
        location = userInput;
        renderWeatherData();
    }
});

renderWeatherData();