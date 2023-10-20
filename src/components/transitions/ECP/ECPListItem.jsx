import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import calculateHoursWorked from "./scripts";
import ECPInput from "./ECPInput";
import UserCard from "../../common/UserCard";

const ECPListItem = ({ employee, reasons, date }) => {
  const { ID, Imie, Nazwisko, Stanowisko, Od, Do } = employee;
  const properHours = calculateHoursWorked(Od, Do);
  const [hours, setHours] = useState(properHours);
  return (
    <UserCard key={employee.ID} employee={employee} hours={hours}>
      <ECPInput
        employee={employee}
        hours={hours}
        setHours={setHours}
        reasons={reasons}
        date={date}
        properHours={properHours}
      />
    </UserCard>
  );
};

export default ECPListItem;
