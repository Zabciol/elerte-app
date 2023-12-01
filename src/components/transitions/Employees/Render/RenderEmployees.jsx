import React from "react";
import EmployeeListItem from "../EmployeeListItem";
import Accordion from "react-bootstrap/Accordion";

const RenderEmployees = ({
  employees,
  dept,
  date,
  showWorkedHours,
  children,
}) => {
  return (
    <>
      {employees.map((employee, index) => (
        <EmployeeListItem
          employee={employee}
          date={date}
          key={`${dept}-${index}`}
          showWorkedHours={showWorkedHours}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { employee: employee });
            }
            return child;
          })}
        </EmployeeListItem>
      ))}
    </>
  );
};

export default RenderEmployees;
