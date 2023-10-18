import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import ECPInput from "./ECPInput";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";

const ECPList = (props) => {
  const filteredSubordinates = props.subordinates.filter(
    (employee) => employee.Dzial === props.dzial
  );

  const addToECP = (newItem) => {
    props.setEmployeesECP((prevECP) => {
      const index = prevECP.findIndex(
        (item) => item.employee === newItem.employee
      );

      if (index === -1) {
        return [...prevECP, newItem];
      } else {
        return [
          ...prevECP.slice(0, index),
          newItem,
          ...prevECP.slice(index + 1),
        ];
      }
    });
  };

  return (
    <Accordion className='ECP'>
      {filteredSubordinates.map((employee) => (
        <ECPListItem
          key={employee.ID}
          employee={employee}
          addToECP={addToECP}
          reasons={props.reasons}
          date={props.date}
        />
      ))}
    </Accordion>
  );
};

export default ECPList;
