import React, { useState } from "react";
import UserCard from "../../common/UserCard";
import { useEffect } from "react";
import { getHoursWorked } from "../../../api/employeesApi";

const EmployeeListItem = ({ employee, date }) => {
  const [workedHours, setWorkedHours] = useState("");

  const getWorkedHours = async () => {
    const response = await getHoursWorked(employee.ID, date);
    console.log(response);
    if (response.length) {
      setWorkedHours(response[0].SumaGodzin);
    } else setWorkedHours(0);
  };

  useEffect(() => {
    getWorkedHours();
  }, [date]);
  return (
    <UserCard
      key={employee.ID}
      employee={employee}
      inf={workedHours}></UserCard>
  );
};

export default EmployeeListItem;
