import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";

const Department = ({
  department,
  employees,
  date,
  children,
  showWorkedHours,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasVisibleEmployees = employees.some((employee) => {
      // Tutaj logika, która określa, czy pracownik powinien być widoczny
      // Może to być na przykład sprawdzenie, czy EmployeeListItem dla tego pracownika zwracałby JSX
      return true; // Zastąp tą logiką
    });

    setVisible(hasVisibleEmployees);
  }, [employees, date, showWorkedHours]);

  if (!visible) {
    return null;
  }

  return (
    <Accordion.Item eventKey={department} key={department}>
      <Accordion.Header>{department}</Accordion.Header>
      <Accordion.Body>
        <Accordion defaultActiveKey='0'>
          {employees.map((employee, index) => (
            <EmployeeListItem
              key={`${department}-${index}`}
              employee={employee}
              date={date}
              showWorkedHours={showWorkedHours}>
              {children}
            </EmployeeListItem>
          ))}
        </Accordion>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Department;
