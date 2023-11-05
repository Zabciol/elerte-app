import React, { Children, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import EmployeeInf from "./EmployeeInf";
const EmployeesList = (props) => {
  console.log(props);
  const { subordinates, dzial, user, date, children } = props;

  const filteredSubordinates =
    dzial === "Każdy"
      ? subordinates
      : subordinates.filter((employee) => employee.Dzial === dzial);

  return (
    <Accordion className='scroll'>
      {filteredSubordinates.map((employee) => (
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
