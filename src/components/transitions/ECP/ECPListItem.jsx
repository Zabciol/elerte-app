import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import ECPInput from "./ECPInput";
import Accordion from "react-bootstrap/Accordion";
import React, { useEffect, useState } from "react";
import calculateHoursWorked from "./scripts";

const ECPListItem = (props) => {
  const employee = props.employee;
  const [hours, setHours] = useState(
    calculateHoursWorked(employee.Od, employee.Do)
  );

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
          hours={hours}
          setHours={setHours}
          reasons={props.reasons}></ECPInput>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ECPListItem;
