import React, { useEffect, useState } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";
import { holidaysApi } from "../../../api/workingTimeApi";
import { calculateWorkingDays } from "../../common/CommonFunctions";
import EmployeeAbsenceInf from "../Employees/EmployeeAbsenceInf";
import { useAuth } from "../Login/AuthContext";
import ProgressBar from "react-bootstrap/ProgressBar";

const Presence = ({ user, date }) => {
  const { setMessage, setShowPopUpLogout } = useAuth();
  const [workedHours, setWorkedHours] = useState(0);
  const [workingHoursInMonth, setWorkingHoursInMonth] = useState(160);

  const getInf = async () => {
    try {
      const data = await hoursWorkedApi(user.ID, date);
      console.log(data);
      if (data[0]) {
        setWorkedHours(data[0].SumaGodzin);
      } else {
        setWorkedHours(0);
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getWorkingDaysInMonth = async () => {
    const holidays = await holidaysApi(date);
    console.log(holidays);
    const count = calculateWorkingDays(date, holidays);
    console.log(count);
    setWorkingHoursInMonth(count * 8);
  };

  useEffect(() => {
    getInf();
    getWorkingDaysInMonth();
  }, [user, date]);

  return (
    <div className='p-5 pt-0'>
      <h3>Obecność</h3>
      <div className='d-flex flex-wrap justify-content-between align-items-top w-100'>
        <div className='home-presence_data'>
          {" "}
          <label>
            Przepracowany czas w tym miesiącu ({workedHours} godzin/y na{" "}
            {workingHoursInMonth})
          </label>
          <ProgressBar
            now={((workedHours / workingHoursInMonth) * 100).toFixed(1)}
            label={`${((workedHours / workingHoursInMonth) * 100).toFixed(1)}%`}
          />
        </div>
        <div className='home-presence_data'>
          <EmployeeAbsenceInf employee={user} date={date} />
        </div>
      </div>
    </div>
  );
};

export default Presence;
