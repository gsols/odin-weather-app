import "./styles.css";

import clearDayIcon from "./assets/clear-day.svg";
import clearNightIcon from "./assets/clear-night.svg";
import partlyDayIcon from "./assets/partly-cloudy-day.svg";
import partlyNightIcon from "./assets/partly-cloudy-night.svg";
import cloudyIcon from "./assets/cloudy.svg";
import windIcon from "./assets/wind.svg";
import rainIcon from "./assets/rain.svg";
import snowIcon from "./assets/snow.svg";


const apiKey = 'NUA2JQ2XKGNC9GNHM8DRPWW4T';
const location = 'paris france';
const unitGroup = 'metric';
const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const url = `${baseUrl}${location}?unitGroup=${unitGroup}&key=${apiKey}&contentType=json`;

const weatherData = async function fetchWeatherData() {
    try{
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

async function renderWeatherData(){
    try{
        const weather = await weatherData();
        const {address, currentConditions, days, description, timezone} = weather;
        
        locationElement.textContent = address;
        // Sunset and Sunrise
        switch(currentConditions.icon){
            case 'clear-day':
                iconElement.src = clearDayIcon;
                break;
            case 'clear-night':
                iconElement.src = clearNightIcon;
                break;
            case 'partly-cloudy-day':
                iconElement.src = partlyDayIcon;
                break;
            case 'partly-cloudy-night':
                iconElement.src = partlyNightIcon;
                break;
            case 'cloudy':
                iconElement.src = cloudyIcon;
                break;
            case 'wind':
                iconElement.src = windIcon;
                break;
            case 'rain':
                iconElement.src = rainIcon;
                break;
            case 'snow':
                iconElement.src = snowIcon;
                break;
            case 'fog':
                iconElement.src = fogIcon;
                break;
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
            { label: 'Precipitation', value: currentConditions.precip + (unitGroup === 'metric' ? ' mm' : ' in') },
            { label: 'Visibility', value: currentConditions.visibility + (unitGroup === 'metric' ? ' km' : ' mi') },
            { label: 'UV Index', value: currentConditions.uvindex }
        ];
        
        conditions.forEach(condition => {
            const listItem = document.createElement('li');
            listItem.textContent = `${condition.label}: ${condition.value}`;
            conditionsListElement.appendChild(listItem);
        });



    }catch(error){

        console.error("Error rendering weather data:", error);
    }
}

renderWeatherData();





