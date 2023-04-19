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

export { geocode };
