import { geocode, oneCall } from "./Logic/Setup";

geocode("toronto").then((data) => {
  oneCall(data).then((country) => {
    console.log(country);
  });
});
