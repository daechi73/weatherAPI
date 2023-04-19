import { geocode } from "./Logic/Setup";

geocode().then((data) => {
  console.log(data);
});
