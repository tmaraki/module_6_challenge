import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

document.addEventListener("DOMContentLoaded", () => {
    $(function() {
        var today = dayjs();
        $('#currentDay').text(today.format('MMM D, YYYY'));
    })

    const currentDateElement = document.getAnimations("currentday")
})

function handleSearchSubmit() {
    const cityInput = document.getElementById("cityInput");
    const cityName = cityInput.value;

    navigator.geolocation.getCurrentPosition(
        (position) => positionSuccess(position, cityName),
        positionError
    );
}



function positionSuccess({ coords }, cityName) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    cityName
    )

    .then(renderWeather)
    .catch(e => {
      console.error(e)
      alert("Error getting weather.")
    });
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  )
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-icon]")
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-wind", current.windSpeed)
  setValue("current-humidity", current.currentHumidity)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true).firstElementChild
    setValue("temp", day.maxTemp, { parent: element })
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}