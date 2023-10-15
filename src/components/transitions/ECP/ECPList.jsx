import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import ECPInput from "./ECPInput";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";
import { reasonsApi } from "../../../api/reasonsApi";

const ECPList = (props) => {
  const [employeesECP, setEmployeesECP] = useState([]);
  const [reasons, setReasons] = useState([]);

  var filteredSubordinates = props.subordinates.filter(
    (employee) => employee.Dzial === props.dzial
  );
  if (props.dzial === "Kazdy") filteredSubordinates = props.subordinates;

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

  const getReasons = async () => {
    try {
      const data = await reasonsApi();
      console.log(data.message);
      setReasons(data.data);
    } catch (error) {
      console.log(error.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    getReasons();
  }, []);

  console.log(employeesECP);
  return (
    <Accordion>
      {filteredSubordinates.map((employee) => (
        <ECPListItem
          employee={employee}
          addToECP={addToECP}
          reasons={reasons}
        />
      ))}
    </Accordion>
  );
};

export default ECPList;
