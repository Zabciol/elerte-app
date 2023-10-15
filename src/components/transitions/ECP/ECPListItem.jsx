import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import calculateHoursWorked from "./scripts";
import ECPInput from "./ECPInput";

const ECPListItem = ({ employee, addToECP, reasons }) => {
  console.log(employee);
  const { ID, Imie, Nazwisko, Stanowisko, Od, Do } = employee;
  const properHours = calculateHoursWorked(Od, Do);
  const [hours, setHours] = useState(properHours);
  console.log(hours);
  return (
    <Accordion.Item eventKey={ID}>
      <Accordion.Header>
        <div className='person'>
          <div className='ms-2 me-auto'>
            <div className='fw-bold'>{`${Imie} ${Nazwisko}`}</div>
            {Stanowisko}
          </div>
          <Badge>{hours}</Badge>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <ECPInput
          employee={employee}
          addToECP={addToECP}
          hours={hours}
          setHours={setHours}
          reasons={reasons}
        />
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ECPListItem;
