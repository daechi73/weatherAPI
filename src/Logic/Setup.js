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

export { geocode, oneCall };
