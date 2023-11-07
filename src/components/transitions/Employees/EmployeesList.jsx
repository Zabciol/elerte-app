import React, { Children, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import EmployeeInf from "./EmployeeInf";
const EmployeesList = (props) => {
  const { subordinates, date, children } = props;

  return (
    <Accordion className='scroll'>
      {subordinates.map((employee) => (
        <EmployeeListItem employee={employee} date={date} key={employee.ID}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                employee: employee,
              });
            }
            return child;
          })}
        </EmployeeListItem>
      ))}
    </Accordion>
  );
};

export default EmployeesList;
