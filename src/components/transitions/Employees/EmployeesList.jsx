import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
const EmployeesList = ({ subordinates, dzial, user, date }) => {
  const filteredSubordinates =
    dzial === "Każdy"
      ? subordinates
      : subordinates.filter((employee) => employee.Dzial === dzial);

  return (
    <>
      <Accordion className='ECP'>
        {filteredSubordinates.map((employee) => (
          <EmployeeListItem employee={employee} date={date} />
        ))}
      </Accordion>
    </>
  );
};

export default EmployeesList;
