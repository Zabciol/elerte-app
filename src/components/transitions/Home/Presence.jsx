import React, { useEffect, useState } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";
import EmployeeAbsenceInf from "../Employees/EmployeeAbsenceInf";
import { useAuth } from "../Login/AuthContext";
import ProgressBar from "react-bootstrap/ProgressBar";

const Presence = ({ user, date }) => {
  const { setMessage, setShowPopUpLogout } = useAuth();
  const [percentOfWorkedHours, setPercentWorkedHours] = useState(0);

  const getInf = async () => {
    try {
      const data = await hoursWorkedApi(user.ID, date);
      console.log(data);
      if (data[0]) {
        console.log(data[0]);
        setPercentWorkedHours(data[0].SumaGodzin);
      } else {
        console.log(
          "Brak danych o przeprawcowanych godzinach dla tego pracownika"
        );
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    getInf();
  }, [user, date]);

  return (
    <div className='p-5 pt-0 text-white'>
      <h3>Obecność</h3>
      <div className='d-flex flex-wrap justify-content-between align-items-top w-100'>
        <div className='home-presence_data'>
          {" "}
          <label>
            Przepracowany czas w tym miesiącu ({percentOfWorkedHours} godzin/y)
          </label>
          <ProgressBar
            now={percentOfWorkedHours / 160}
            label={`${percentOfWorkedHours / 160}%`}
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
