import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Department from "./Department"; // Zakładam, że masz już komponent Department
import EmployeeListItem from "./EmployeeListItem";

const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;

  const renderDepartments = () => {
    return Object.entries(subordinates).map(([dept, employees]) => (
      <Department
        key={dept}
        department={dept}
        employees={employees}
        date={date}
        showWorkedHours={showWorkedHours}>
        {children}
      </Department>
    ));
  };

  const renderEmployeesForDepartment = (employees) => {
    return employees.map((employee, index) => (
      <EmployeeListItem
        key={`${dzial}-${index}`}
        employee={employee}
        date={date}
        showWorkedHours={showWorkedHours}>
        {children}
      </EmployeeListItem>
    ));
  };

  return (
    <Accordion className='scroll'>
      {dzial === "Każdy" ? (
        typeof subordinates === "object" ? (
          <>{renderDepartments()}</>
        ) : (
          <div className='no-data-message'>Brak danych</div>
        )
      ) : Array.isArray(subordinates) && subordinates.length > 0 ? (
        <>{renderEmployeesForDepartment(subordinates)}</>
      ) : (
        <div className='no-data-message'>Brak danych</div>
      )}
    </Accordion>
  );
});

export default EmployeesList;
