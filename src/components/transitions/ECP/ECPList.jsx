import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import ECPInput from "./ECPInput";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";
import { reasonsApi } from "../../../api/reasonsApi";

const ECPList = (props) => {
  const [reasons, setReasons] = useState([]);

  var filteredSubordinates =
    props.dzial === "Kazdy"
      ? props.subordinates
      : props.subordinates.filter((employee) => employee.Dzial === props.dzial);

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

  return (
    <Accordion className='ECP'>
      {filteredSubordinates.map((employee) => (
        <ECPListItem
          key={employee.ID}
          employee={employee}
          addToECP={props.addToECP}
          reasons={reasons}
          employeesECP={props.employeesECP}
        />
      ))}
    </Accordion>
  );
};

export default ECPList;
