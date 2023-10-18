const PORT = 8000;

const Variables = {
  port: PORT,
};
export default Variables;

const getTodayDate = () => {
  const date = new Date();
  const today = {
    year: date.getFullYear(),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    day: date.getDate().toString().padStart(2, "0"),
  };
  return today;
};

export const getDateYearMonth = () => {
  const date = getTodayDate();
  return `${date.year}-${date.month}`;
};

export const getDateYearMonthDay = () => {
  const date = getTodayDate();
  return `${date.year}-${date.month}-${date.day}`;
};
