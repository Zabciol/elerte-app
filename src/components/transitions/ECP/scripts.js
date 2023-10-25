function calculateHoursWorked(start, end) {
  if (!start || !end) {
    return 0;
  }

  const [startHour, startMinutes] = start.split(":").map(Number);
  const [endHour, endMinutes] = end.split(":").map(Number);

  const startDate = new Date(0, 0, 0, startHour, startMinutes);
  const endDate = new Date(0, 0, 0, endHour, endMinutes);

  let diff = endDate.getTime() - startDate.getTime();

  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  const hours = diff / (1000 * 60 * 60);

  return hours;
}
export default calculateHoursWorked;
