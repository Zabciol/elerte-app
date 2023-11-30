import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
const UserCard = (props) => {
  const { employee, reasons, date, children, inf } = props;
  const { ID, Imie, Nazwisko, Stanowisko } = employee;

  const employeeEventKey = `emp-${employee.ID}`;
  return (
    <Accordion.Item eventKey={employeeEventKey}>
      <Accordion.Header>
        <div className='d-flex w-100 pt-1 pe-2 justify-content-between'>
          <div className='ms-2 me-auto'>
            <div className='fw-bold'>{`${employee.Imie} ${employee.Nazwisko}`}</div>
            {employee.Stanowisko}
          </div>
          {inf !== null ? <Badge>{inf}</Badge> : null}
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <div style={{ overflow: "hidden" }}>{children}</div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default UserCard;
