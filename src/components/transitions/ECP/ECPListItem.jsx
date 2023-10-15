import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import ECPInput from "./ECPInput";
import Accordion from "react-bootstrap/Accordion";
import React, { useState } from "react";

const ECPListItem = (props) => {
  const [hours, setHours] = useState(8);
  const employee = props.employee;
  return (
    <Accordion.Item eventKey={employee.ID}>
      <Accordion.Header>
        <div className='person'>
          <div className='ms-2 me-auto'>
            <div className='fw-bold'>
              {employee.Imie + " " + employee.Nazwisko}
            </div>
            {employee.Stanowisko}
          </div>
          <Badge>{hours}</Badge>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <ECPInput
          employee={employee}
          addToECP={props.addToECP}
          setHours={setHours}></ECPInput>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ECPListItem;
