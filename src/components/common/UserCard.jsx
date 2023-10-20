import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";

const UserCard = ({ employee, reasons, date, children, inf }) => {
  const { ID, Imie, Nazwisko, Stanowisko, Od, Do } = employee;
  return (
    <Accordion.Item eventKey={ID}>
      <Accordion.Header>
        <div className='person'>
          <div className='ms-2 me-auto'>
            <div className='fw-bold'>{`${Imie} ${Nazwisko}`}</div>
            {Stanowisko}
          </div>
          <Badge>{inf}</Badge>
        </div>
      </Accordion.Header>
      <Accordion.Body className='ecp-accordion'>{children}</Accordion.Body>
    </Accordion.Item>
  );
};

export default UserCard;
