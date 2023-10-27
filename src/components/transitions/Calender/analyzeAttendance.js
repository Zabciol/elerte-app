function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function wasLate(arrivalTime, startWorkTime) {
  return arrivalTime > startWorkTime;
}

function leftEarly(leaveTime, endWorkTime) {
  return leaveTime < endWorkTime;
}

function workedFullHours(arrivalTime, leaveTime, requiredHours) {
  return leaveTime - arrivalTime >= requiredHours;
}

function addTimeEntry(result, type, from, to) {
  result.push({
    type: type,
    from: from,
    to: to,
  });
}

async function analyzeAttendance(attendanceData, employeeData) {
  const result = [];

  const startWorkTime = timeToMinutes(employeeData.Od);
  const endWorkTime = timeToMinutes(employeeData.Do);
  const requiredHours = endWorkTime - startWorkTime;
  const arrivalTime = timeToMinutes(attendanceData.Od_godz);
  const leaveTime = timeToMinutes(attendanceData.Do_godz);

  if (
    wasLate(arrivalTime, startWorkTime) &&
    !leftEarly(leaveTime, endWorkTime) &&
    workedFullHours(arrivalTime, leaveTime, requiredHours)
  ) {
    addTimeEntry(
      result,
      "Obecność",
      attendanceData.Od_godz,
      attendanceData.Do_godz
    );
  } else if (
    !wasLate(arrivalTime, startWorkTime) &&
    leftEarly(leaveTime, endWorkTime) &&
    workedFullHours(arrivalTime, leaveTime, requiredHours)
  ) {
    addTimeEntry(
      result,
      "Obecność",
      attendanceData.Od_godz,
      attendanceData.Do_godz
    );
  } else {
    if (wasLate(arrivalTime, startWorkTime)) {
      addTimeEntry(
        result,
        "Nieobecność",
        employeeData.Od,
        attendanceData.Od_godz
      );
    }

    if (leftEarly(leaveTime, endWorkTime)) {
      if (
        !wasLate(arrivalTime, startWorkTime) ||
        workedFullHours(arrivalTime, leaveTime, requiredHours)
      ) {
        addTimeEntry(
          result,
          "Obecność",
          attendanceData.Od_godz,
          attendanceData.Do_godz
        );
      }

      addTimeEntry(
        result,
        "Nieobecność",
        attendanceData.Do_godz,
        employeeData.Do
      );
    } else {
      addTimeEntry(
        result,
        "Obecność",
        attendanceData.Od_godz,
        attendanceData.Do_godz
      );
    }
  }

  return result;
}

// Test
const attendanceData = {
  Data: "2023-10-21",
  Do_godz: "16:00",
  ID: 4,
  IloscGodzin: 7,
  Od_godz: "09:00",
  Powod: "E-Nieobecność",
};

const employeeData = {
  Do: "16:00",
  Od: "08:00",
  Stanowisko: "Dyrektor",
};

//console.log(analyzeAttendance(attendanceData, employeeData));

export default analyzeAttendance;
