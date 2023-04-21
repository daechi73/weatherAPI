import { format } from "date-fns";
import svgCollection from "../SVG/SvgCollection";

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
  //console.log(geocodeData);
  return geocode;
};

const currentWeather = async (geocode) => {
  const { lat, lon } = geocode;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8fc4fd101e5832e98fe2788ea8710650`,
    { mode: "cors" }
  );
  const data = await response.json();
  //console.log(data);
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
const weatherSVG = (weather) => {
  let getSVG;
  if (weather === "Clouds") getSVG = svgCollection().clouds;
  else if (weather === "Thunderstorm") getSVG = svgCollection().thunderStorm;
  else if (weather === "Drizzle") getSVG = svgCollection().drizzle;
  else if (weather === "Rain") getSVG = svgCollection().rain;
  else if (weather === "Snow") getSVG = svgCollection().snow;
  else if (weather === "Mist" || weather === "Fog" || weather === "Haze")
    getSVG = svgCollection().fog;
  else if (weather === "Dust" || weather === "Sand" || weather === "Ash")
    getSVG = svgCollection().dust;
  else if (weather === "Squall") getSVG = svgCollection().squalls;
  else if (weather === "Tornado") getSVG = svgCollection().tornado;
  else if (weather === "Smoke") getSVG = svgCollection().smoke;
  else if (weather === "Wind") getSVG = svgCollection().wind;
  else if (weather === "Clear") getSVG = svgCollection().clear;
  else if (weather === `Daytime`) getSVG = svgCollection().dayTime;
  else if (weather === "Nightime") getSVG = svgCollection().nightTime;
  else {
    console.log("No such Weather!");
  }
  return getSVG;
};
const renderDaily = (dataList, nextFourDates) => {
  const createDailyBox = (days, dayTemps, nightTemps, afternoonWeather) => {
    const dailyBoxContainer = document.querySelector(".dailyBoxContainer");
    const dailyBox = document.createElement("div");
    const day = document.createElement("div");
    const dayTemp = document.createElement("div");
    const nightTemp = document.createElement("div");
    dailyBox.classList.add("dailyBox");
    day.classList.add("day");
    dayTemp.classList.add("dayTemp");
    nightTemp.classList.add("nightTemp");
    day.innerHTML = `${days} ${weatherSVG(afternoonWeather)}`;
    dayTemp.innerHTML = `
      <img src="./svgs/fog-day.svg" alt="daytime" width="40px" height="40px">
      <span>${dayTemps}C</span>
    `;
    nightTemp.innerHTML = `
      <img src="./svgs/haze-night.svg" alt="nightime" width="40px" height="40px">
      <span>${nightTemps}C</span>
    `;
    dailyBox.appendChild(day);
    dailyBox.appendChild(dayTemp);
    dailyBox.appendChild(nightTemp);
    dailyBoxContainer.appendChild(dailyBox);
  };
  document.querySelector(".dailyBoxContainer").textContent = "";
  nextFourDates.forEach((e) => {
    const afternoonDate = dataList.find((data) => {
      return data.dt_txt === e.afternoon;
    });
    const nightDate = dataList.find((data) => {
      return data.dt_txt === e.night;
    });
    //console.log(afternoonDate.weather[0].main);
    //console.log(nightDate);

    createDailyBox(
      e.day,
      afternoonDate.main.temp,
      nightDate.main.temp,
      afternoonDate.weather[0].main
    );
  });
  //format(today, "yyyy-MM-dd k:mm:ss") time format
};

const renderCurrentInfo = (country) => {
  //console.log(country);
  const locationName = document.querySelector(".location");
  const weatherDesc = document.querySelector(".weather-desc");
  const windSpeed = document.querySelector(".speed");
  const windDegree = document.querySelector(".degree");
  const mainTemp = document.querySelector(".temp");
  const feelsLike = document.querySelector(".feelsLike");
  const tempMin = document.querySelector(".tempMin");
  const tempMax = document.querySelector(".tempMax");
  locationName.innerHTML = country.name;
  weatherDesc.innerHTML = ` 
        ${country.weather[0].description}
        ${weatherSVG(country.weather[0].main)}`;

  windSpeed.innerHTML = `<img src="./svgs/wind.svg" alt="wind" height="30px" width="30px"> <span>${country.wind.speed} m/s</span>`;
  windDegree.innerHTML = `<img src="./svgs/wind.svg" alt="wind" height="30px" width="30px"><span> ${country.wind.deg} deg</span>`;
  mainTemp.innerHTML = `<img src="./svgs/thermometer-celsius.svg"height="30px" width="30px" alt="thermo" ><span>Avg Temp ~ ${country.main.temp}c</span>`;
  feelsLike.innerHTML = `<img src="./svgs/thermometer-celsius.svg"height="30px" width="30px" alt="thermo" ><span> Feels Like ~ ${country.main.feels_like}c</span>`;
  tempMin.innerHTML = `<img src="./svgs/thermometer-celsius.svg"height="30px" width="30px" alt="thermo" >Min Temp ~ ${country.main.temp_min}c`;
  tempMax.innerHTML = `<img src="./svgs/thermometer-celsius.svg"height="30px" width="30px" alt="thermo" >Max Temp ~ ${country.main.temp_max}c`;
};

const searchBtnEventHandler = () => {
  const errorMsg = document.querySelector(".errorMsg");
  const sBtn = document.querySelector(".searchBtn");
  sBtn.addEventListener("click", () => {
    try {
      const input = document.querySelector(".searchBar");
      //console.log(input);
      if (input.value === "") {
        throw new Error("Your input is empty");
      }
      geocode(input.value).then((geocodeData) => {
        if (geocodeData == null || geocodeData === undefined) {
          errorMsg.textContent = `Couldn't find 
          what you are searching for, make sure you are searching for a city/country`;
          throw new Error(`Couldn't find 
          what you are searching for, make sure you are searching for a city/country`);
        } else {
          errorMsg.textContent = "";
        }

        currentWeather(geocodeData).then((weatherInfo) => {
          renderCurrentInfo(weatherInfo);
          //console.log(weatherInfo);
        });

        fiveDays(geocodeData).then((weatherInfo) => {
          //console.log(weatherInfo.list);
          //console.log(renderDaily(weatherInfo.list));
          renderDaily(weatherInfo.list, getNextFourDates());
        });
      });
    } catch (error) {
      console.log(error);
      errorMsg.textContent = "Please enter a country or city name";
    }
  });
};

const startUp = () => {
  searchBtnEventHandler();
};

export { geocode, currentWeather, startUp };
