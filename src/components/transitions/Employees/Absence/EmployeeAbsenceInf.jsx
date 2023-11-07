import React from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
const EmployeeAbsenceInf = ({ employee }) => {
  console.log(employee);
  return (
    <div className='d-flex flex-wrap'>
      <div>
        Nagłe
        <ListGroup as='ol' numbered>
          {employee.Nieobecnosci.map((absence) => (
            <ListGroup.Item
              key={absence.Data}
              as='li'
              className='d-flex justify-content-between align-items-start'>
              <div className='ms-2 me-auto'>
                <div className='fw-bold'>{absence.Powod}</div>
                {"Przepracowane godziny: " + absence.IloscGodzin}
              </div>
              <Badge bg='primary' pill>
                {absence.Data}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div>
        Zaplanowane
        <ListGroup as='ol' numbered>
          {employee.Urlopy.map((absence) => (
            <ListGroup.Item
              key={absence.Data_Od}
              as='li'
              className='d-flex justify-content-between align-items-start'>
              <div className='ms-2 me-auto'>
                <div className='fw-bold'>{absence.Powod}</div>
                {"Zaakceptowane przez: " +
                  absence.ImieAkceptujacego +
                  " " +
                  absence.NazwiskoAkceptujacego}
              </div>
              <Badge bg='primary' pill>
                {absence.Data_Od + " / " + absence.Data_Do}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default EmployeeAbsenceInf;
