const { queryDatabase, queryDatabasePromise } = require("../db");
const Holidays = require("date-holidays");

const getWorkingTime = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from WymiarPracy`;

    queryDatabase(query, [], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

const getHolidaysForMonth = (year, month) => {
  year = Number(year);
  month = Number(month);

  if (typeof year !== "number" || typeof month !== "number") {
    throw new Error("Both year and month must be numbers.");
  }
  const hd = new Holidays("PL");
  const allHolidays = hd.getHolidays(year);

  return allHolidays
    .filter((holiday) => holiday.type === "public")
    .filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getMonth() === month;
    })
    .map((holiday) => {
      return {
        date: holiday.date,
        name: holiday.name,
      };
    });
};

module.exports = {
  getWorkingTime,
  getHolidaysForMonth,
};
