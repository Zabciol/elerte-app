import React from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
const EmployeeAbsenceInf = ({ employee }) => {
  console.log(employee);
  return (
    <div className='d-flex absence w-100'>
      <div className='w-100'>
        {employee.Nieobecnosci.length ? (
          <>
            Nagłe
            <ListGroup as='ol' numbered>
              {employee.Nieobecnosci.map((absence) => (
                <ListGroup.Item
                  key={absence.Data}
                  as='li'
                  className='d-flex justify-content-between align-items-start absence-list-item '>
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold'>{absence.Powod}</div>
                    {"Przepracowane godziny: " + absence.IloscGodzin}
                  </div>
                  <Badge bg='primary' pill className='absence-badge'>
                    {absence.Data}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : null}
      </div>
      <div className='w-100'>
        {employee.Urlopy.length ? (
          <>
            Zaplanowane
            <ListGroup as='ol' numbered>
              {employee.Urlopy.map((absence) => (
                <ListGroup.Item
                  key={absence.Data_Od}
                  as='li'
                  className='d-flex justify-content-between align-items-start absence-list-item'>
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold'>{absence.Powod}</div>
                    {"Zaakceptowane przez: " +
                      absence.ImieAkceptujacego +
                      " " +
                      absence.NazwiskoAkceptujacego}
                  </div>
                  <Badge bg='primary' pill className='absence-badge'>
                    {absence.Data_Od + " / " + absence.Data_Do}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>{" "}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeAbsenceInf;
