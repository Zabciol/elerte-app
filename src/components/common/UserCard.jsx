import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
const UserCard = (props) => {
  const { employee, reasons, date, children, inf } = props;
  const { ID, Imie, Nazwisko, Stanowisko } = employee;

  return (
    <div>
      <div style={{ overflow: "hidden" }}>{children}</div>
    </div>
  );
};

export default UserCard;
