import { eachDayOfInterval, isWeekend } from "date-fns";
const PORT = 8000;

const Variables = {
  port: PORT,
  //host: "https://ewidencja.elerte.local",
  host: "http://localhost",
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
export const getNextWorkDay = () => {
  let date = new Date();
  date.setDate(date.getDate() + 1); // najbliższy dzień

  // Jeśli jutro to sobota, dodaj 2 dni
  if (date.getDay() === 6) {
    date.setDate(date.getDate() + 2);
  }
  // Jeśli jutro to niedziela, dodaj 1 dzień
  else if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
};

export const handleError = (error) => {
  console.log("Handle error: ", error);
  if (error.response) {
    throw new Error(
      error.response.data || "Błąd podczas pobierania danych z API"
    );
  } else if (error.request) {
    throw new Error("Brak odpowiedzi od serwera");
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error("API not available");
  }
};

export const calculateWorkingDays = (date, holidays) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const allDaysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const workingDays = allDaysInMonth.filter((day) => !isWeekend(day));

  const holidayDates = holidays.map((holiday) =>
    new Date(holiday.date).toISOString()
  );
  const workingDaysWithoutHolidays = workingDays.filter(
    (day) => !holidayDates.includes(day.toISOString())
  );

  return workingDaysWithoutHolidays.length;
};
