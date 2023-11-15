import React, { useEffect, useState } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";
import { useAuth } from "../Login/AuthContext";
const Presence = ({ user, date }) => {
  const { setMessage, setShowPopUpLogout } = useAuth();
  const [workedHours, setWorkedHours] = useState(0);

  const getInf = async () => {
    try {
      const data = await hoursWorkedApi(user.ID, date);
      console.log(data[0]);
      setWorkedHours(data[0].SumaGodzin);
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
    <div className='pt-3 text-white'>
      <h3>Obecność</h3>
      <div className='flex '></div>
    </div>
  );
};

export default Presence;
