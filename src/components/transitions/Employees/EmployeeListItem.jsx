import React, { Children, useState } from "react";
import UserCard from "../../common/UserCard";
import { useEffect } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";
import { useAuth } from "../Login/AuthContext";

const EmployeeListItem = ({ employee, date, children, showWorkedHours }) => {
  const [workedHours, setWorkedHours] = useState(null);
  const { setShowPopUpLogout, setMessage } = useAuth();

  const getWorkedHours = async () => {
    if (employee.ID && date) {
      try {
        const response = await hoursWorkedApi(employee.ID, date);
        if (response.length) {
          setWorkedHours(response[0].SumaGodzin);
        } else setWorkedHours(0);
      } catch (error) {
        console.error(error);
        setMessage(error.message);
        setShowPopUpLogout(true);
      }
    }
  };

  useEffect(() => {
    if (showWorkedHours) getWorkedHours();
  }, [date, employee]);
  return (
    <UserCard key={employee.ID} employee={employee} inf={workedHours}>
      {children}
    </UserCard>
  );
};

export default EmployeeListItem;
