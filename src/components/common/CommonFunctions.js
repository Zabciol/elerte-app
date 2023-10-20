const PORT = 8000;

const Variables = {
  port: PORT,
};
export default Variables;

const getTodayDate = () => {
  const date = new Date();
  const today = {
    year: date.getFullYear(),
    month: String(date.getMonth() + 1)
      .toString()
      .padStart(2, "0"),
    day: String(date.getDate().toString()).padStart(2, "0"),
    hours: String(date.getHours()).padStart(2, "0"),
    minutes: String(date.getMinutes()).padStart(2, "0"),
    seconds: String(date.getSeconds()).padStart(2, "0"),
  };
  return today;
};

export const getCurrentDateYearMonth = () => {
  const date = getTodayDate();
  return `${date.year}-${date.month}`;
};

export const getCurrentDateYearMonthDay = () => {
  const date = getTodayDate();
  return `${date.year}-${date.month}-${date.day}`;
};
export const getCurrentDateTime = () => {
  const date = getTodayDate();
  return `${date.year}-${date.month}-${date.day} ${date.hours}:${date.minutes}:${date.seconds}`;
};

export const setDarkThemeForApp = (dark) => {
  const html = document.documentElement;
  if (dark) {
    localStorage.setItem("DarkTheme", JSON.stringify(dark));
    html.setAttribute("data-bs-theme", "dark");
    html.setAttribute("data-theme", "dark");
  } else {
    localStorage.setItem("DarkTheme", JSON.stringify(dark));
    html.setAttribute("data-bs-theme", "light");
    html.setAttribute("data-theme", "light");
  }
};
