export const toCel = (temp) => ((temp - 32) * 5) / 9;
export const toFahr = (temp) => (temp * 9) / 5 + 32;
export const KtoFahr = (temp) => (temp - 273.15) * 1.8 + 32;
export const KtoCel = (temp) => temp - 273.15;

export const getDay = (date) => {
  let weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return weekday[new Date(date).getDay()];
};
