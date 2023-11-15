import React, { useEffect, useState } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";
import { useAuth } from "../Login/AuthContext";
import ProgressBar from "react-bootstrap/ProgressBar";
import EmployeesAbsence from "../Employees/Absence/EmployeesAbsence";
const Presence = ({ user, date }) => {
  const { setMessage, setShowPopUpLogout } = useAuth();
  const [percentOfWorkedHours, setPercentWorkedHours] = useState(0);

  const getInf = async () => {
    try {
      const data = await hoursWorkedApi(user.ID, date);
      console.log(data[0]);
      setPercentWorkedHours(data[0].SumaGodzin);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    getInf();
  }, []);

  return (
    <div className='p-5 pt-0 text-white'>
      <h3>Obecność</h3>
      <div className='d-flex justify-content-between align-items-top'>
        <div className='w-100 p-5 pt-2'>
          {" "}
          <label>
            Przepracowany czas w tym miesiącu ({percentOfWorkedHours} godzin/y)
          </label>
          <ProgressBar
            now={percentOfWorkedHours / 160}
            label={`${percentOfWorkedHours / 160}%`}
          />
        </div>
        <div className='w-100 p-5 pt-2'>
          <EmployeesAbsence subordinates={[user]} date={date} />
        </div>
      </div>
    </div>
  );
};

export default Presence;
