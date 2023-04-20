import { format } from "date-fns";

const geocode = async (city) => {
  const response = await fetch(
    `
    http://api.openweathermap.org/geo/1.0/direct?q=${city}
    &limit=5&appid=8fc4fd101e5832e98fe2788ea8710650
    `,
    { mode: "cors" }
  );
  const geocodeData = await response.json();

  const geocode = geocodeData.find((geocode) => {
    return geocode.name.toLowerCase() === city.toLowerCase();
  });
  console.log(geocode);
  return geocode;
};

const currentWeather = async (geocode) => {
  const { lat, lon } = geocode;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8fc4fd101e5832e98fe2788ea8710650`,
    { mode: "cors" }
  );
  const data = await response.json();
  console.log(data);
  return data;
};

const fiveDays = async (geocode) => {
  const { lat, lon } = geocode;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=8fc4fd101e5832e98fe2788ea8710650`,
    { mode: "cors" }
  );
  const data = await response.json();
  //console.log(data);
  return data;
};
const getNextFourDates = () => {
  const nextDay = new Date();
  const nextFourDates = [];
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (let i = 0; i < 4; i++) {
    nextDay.setDate(nextDay.getDate() + 1);
    nextFourDates.push({
      afternoon: format(nextDay, "yyyy-MM-dd") + " " + "15:00:00",
      night: format(nextDay, "yyyy-MM-dd") + " " + "21:00:00",
      day: weekday[nextDay.getDay()],
    });
  }
  return nextFourDates;
};

const renderDaily = (dataList, nextFourDates) => {
  const createDailyBox = (days, dayTemps, nightTemps) => {
    const dailyBoxContainer = document.querySelector(".dailyBoxContainer");
    const dailyBox = document.createElement("div");
    const day = document.createElement("div");
    const dayTemp = document.createElement("div");
    const nightTemp = document.createElement("div");
    dailyBox.classList.add("dailyBox");
    day.classList.add("day");
    dayTemp.classList.add("dayTemp");
    nightTemp.classList.add("nightTemp");
    day.textContent = `${days}`;
    dayTemp.textContent = `${dayTemps}C`;
    nightTemp.textContent = `${nightTemps}C`;
    dailyBox.appendChild(day);
    dailyBox.appendChild(dayTemp);
    dailyBox.appendChild(nightTemp);
    dailyBoxContainer.appendChild(dailyBox);
  };
  const dailyBoxContainer = (document.querySelector(
    ".dailyBoxContainer"
  ).textContent = "");
  nextFourDates.forEach((e) => {
    const afternoonDate = dataList.find((data) => {
      return data.dt_txt === e.afternoon;
    });
    const nightDate = dataList.find((data) => {
      return data.dt_txt === e.night;
    });
    //console.log(afternoonDate);
    //console.log(nightDate);

    createDailyBox(e.day, afternoonDate.main.temp, nightDate.main.temp);
  });
  //format(today, "yyyy-MM-dd k:mm:ss") time format
};

const renderCurrentInfo = (country) => {
  //console.log(country);
  const locationName = document.querySelector(".location");
  const weatherDesc = document.querySelector(".weather-description");
  const windSpeed = document.querySelector(".speed");
  const windDegree = document.querySelector(".degree");
  const mainTemp = document.querySelector(".temp");
  const feelsLike = document.querySelector(".feelsLike");
  const tempMin = document.querySelector(".tempMin");
  const tempMax = document.querySelector(".tempMax");
  locationName.textContent = country.name;
  weatherDesc.textContent = country.weather[0].description;
  windSpeed.textContent = `Speed: ${country.wind.speed}`;
  windDegree.textContent = `Degree: ${country.wind.deg}`;
  mainTemp.textContent = `Temp: ${country.main.temp}c`;
  feelsLike.textContent = `Feels Like: ${country.main.feels_like}c`;
  tempMin.textContent = `Min Temp: ${country.main.temp_min}c`;
  tempMax.textContent = `Max Temp: ${country.main.temp_max}c`;
};

const searchBtnEventHandler = () => {
  const sBtn = document.querySelector(".searchBtn");
  sBtn.addEventListener("click", () => {
    const input = document.querySelector(".searchBar");
    //console.log(input);
    geocode(input.value).then((geocodeData) => {
      currentWeather(geocodeData).then((weatherInfo) => {
        renderCurrentInfo(weatherInfo);
      });

      fiveDays(geocodeData).then((weatherInfo) => {
        //console.log(weatherInfo.list);
        //console.log(renderDaily(weatherInfo.list));
        renderDaily(weatherInfo.list, getNextFourDates());
      });
    });
  });
};

const startUp = () => {
  searchBtnEventHandler();
};

export { geocode, currentWeather, startUp };
