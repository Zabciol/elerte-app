const PORT = 8000;

const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, "0");
const day = date.getDate().toString().padStart(2, "0");

const dateYearMonth = `${year}-${month}`;
const dateYearMonthDay = `${year}-${month}-${day}`;

const Variables = {
  port: PORT,
  dateYearMonth: dateYearMonth,
  dateYearMonthDay: dateYearMonthDay,
};
export default Variables;
