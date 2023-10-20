import React, { useState } from "react";
import UserCard from "../../common/UserCard";
import { useEffect } from "react";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { getHoursWorked } from "../../../api/employeesApi";

const EmployeeListItem = ({ employee }) => {
  const [workedHours, setWorkedHours] = useState("");

  const getWorkedHours = async () => {
    const response = await getHoursWorked(
      employee.ID,
      getCurrentDateYearMonth()
    );
    console.log(response);
    setWorkedHours(response[0].SumaGodzin);
  };

  useEffect(() => {
    getWorkedHours();
  }, []);
  return (
    <UserCard
      key={employee.ID}
      employee={employee}
      inf={workedHours}></UserCard>
  );
};

export default EmployeeListItem;
