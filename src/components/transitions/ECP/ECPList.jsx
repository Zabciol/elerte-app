import React from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";

const ECPList = (props) => {
  var filteredSubordinates = props.subordinates.filter(
    (employee) => employee.Dzial === props.dzial
  );
  if (props.dzial === "Kazdy") filteredSubordinates = props.subordinates;
  console.log(filteredSubordinates);
  return (
    <ListGroup as='ol' numbered>
      {filteredSubordinates.map((employee) => (
        <ListGroup.Item
          as='li'
          className='d-flex justify-content-between align-items-start'>
          <div className='ms-2 me-auto'>
            <div className='fw-bold'>
              {employee.Imie + " " + employee.Nazwisko}
            </div>
            {employee.Stanowisko}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ECPList;
