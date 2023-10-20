import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
const EmployeesList = ({ subordinates, dzial, user }) => {
  const filteredSubordinates =
    dzial === "Każdy"
      ? subordinates
      : subordinates.filter((employee) => employee.Dzial === dzial);

  return (
    <>
      <Accordion className='ECP'>
        {filteredSubordinates.map((employee) => (
          <EmployeeListItem employee={employee} />
        ))}
      </Accordion>
    </>
  );
};

export default EmployeesList;
