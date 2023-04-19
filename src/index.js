import { geocode } from "./Logic/Setup";

geocode("toronto").then((data) => {
  console.log(data);
});
