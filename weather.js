import axios from "axios";
import cityIdList from "./cityList.json";

export function getWeather(lat, lon, timezone, cityName) {
  const apiKey = "3a8426749ab5707c8d337bd008a22c9d";
  const cityId = getCityId(cityName);
  if (!cityId) {
    return Promise.reject("City not found")
  }

  const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=${cityId}&appid={3a8426749ab5707c8d337bd008a22c9d}'

    return axios
      .get(apiUrl, {
          params: {
            latitude: lat,
            longitude: lon,
            timezone,
          },
        })
      .then(({ data }) => {
        return {
          current: parseCurrentWeather(data),
          daily: parseDailyWeather(data),
          hourly: parseHourlyWeather(data),
        }
      })
  }


function parseCurrentWeather({ current_weather, daily }) {
    const {
      temperature: currentTemp,
      windspeed: windSpeed,
      weathercode: iconCode,
      humidity: currentHumidity,
    } = current_weather
    const {
    } = daily
  
    return {
      currentTemp: Math.round(currentTemp),
      windSpeed: Math.round(windSpeed),
      humidity: Math.round(currentHumidity * 100) / 100,
      iconCode,
    }
  }
  
  function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
      return {
        timestamp: time * 1000,
        iconCode: daily.weathercode[index],
      }
    })
  }

  function getCityId(cityName) {
    const cityId = cityIdList[cityName];
    if (cityId) {
      return cityId;
    } else {
      console.error(`City ID not found for ${cityName}`);
      return null;
    }
  }

