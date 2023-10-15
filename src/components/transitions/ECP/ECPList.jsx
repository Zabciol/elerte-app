import React, { useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import ECPInput from "./ECPInput";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";

const ECPList = (props) => {
  const [employeesECP, setEmployeesECP] = useState([]);

  var filteredSubordinates = props.subordinates.filter(
    (employee) => employee.Dzial === props.dzial
  );
  if (props.dzial === "Kazdy") filteredSubordinates = props.subordinates;
  console.log(filteredSubordinates);

  const addToECP = (newItem) => {
    setEmployeesECP((prevECP) => {
      const index = prevECP.findIndex(
        (item) => item.employee === newItem.employee
      );

      if (index === -1) {
        // Element o takim ID nie istnieje - dodaj nowy element do tablicy
        return [...prevECP, newItem];
      } else {
        // Element o takim ID istnieje - zamień istniejący element na nowy
        return [
          ...prevECP.slice(0, index),
          newItem,
          ...prevECP.slice(index + 1),
        ];
      }
    });
  };
  console.log(employeesECP);

  return (
    <>
      <Accordion>
        {filteredSubordinates.map((employee) => (
          <ECPListItem employee={employee} addToECP={addToECP} />
        ))}
      </Accordion>
    </>
  );
};

export default ECPList;
