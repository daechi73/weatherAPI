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
  return geocode;
};

const oneCall = async (geocode) => {
  const { lat, lon } = geocode;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8fc4fd101e5832e98fe2788ea8710650`,
    { mode: "cors" }
  );
  const countryData = await response.json();

  return countryData;
};

const renderInfo = (country) => {
  console.log(country);
  const locationName = document.querySelector(".location");
  const weatherMain = document.querySelector(".weather-main");
  const weatherDesc = document.querySelector(".weather-description");
  const windSpeed = document.querySelector(".speed");
  const windDegree = document.querySelector(".degree");
  const mainTemp = document.querySelector(".temp");
  const feelsLike = document.querySelector(".feelsLike");
  const tempMin = document.querySelector(".tempMin");
  const tempMax = document.querySelector(".tempMax");
  locationName.textContent = country.name;
  weatherMain.textContent = country.weather[0].main;
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
    geocode(input.value).then((data) => {
      oneCall(data).then((country) => {
        renderInfo(country);
      });
    });
  });
};

const startUp = () => {
  searchBtnEventHandler();
};

export { geocode, oneCall, startUp };
