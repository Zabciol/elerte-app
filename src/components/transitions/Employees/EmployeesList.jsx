import React, { Children } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import EmployeeInf from "./EmployeeInf";
const EmployeesList = (props) => {
  const { subordinates, dzial, user, date, children } = props;
  const filteredSubordinates =
    dzial === "Każdy"
      ? subordinates
      : subordinates.filter((employee) => employee.Dzial === dzial);

  return (
    <Accordion className='ECP'>
      {filteredSubordinates.map((employee) => (
        <EmployeeListItem employee={employee} date={date}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                additionalProp: "value",
                anotherAdditionalProp: "anotherValue",
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
