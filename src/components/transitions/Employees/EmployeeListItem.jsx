import React, { Children, useState } from "react";
import UserCard from "../../common/UserCard";
import { useEffect } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";

const EmployeeListItem = ({ employee, date, children }) => {
  const [workedHours, setWorkedHours] = useState("");

  const getWorkedHours = async () => {
    if (employee.ID && date) {
      console.log(employee.ID);
      console.log(date);
      const response = await hoursWorkedApi(employee.ID, date);
      if (response.length) {
        setWorkedHours(response[0].SumaGodzin);
      } else setWorkedHours(0);
    }
  };

  useEffect(() => {
    getWorkedHours();
  }, [date, employee]);
  return (
    <UserCard key={employee.ID} employee={employee} inf={workedHours}>
      {children}
    </UserCard>
  );
};

export default EmployeeListItem;
