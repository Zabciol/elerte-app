import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FormPopUp from "./Edit/FormPopUp";
import { infApi } from "../../../api/employeesApi";
import "../../../styles/Employee.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const EmployeeInf = (props) => {
  const [inf, setInf] = useState();
  const [show, setShow] = useState(false);
  const getInformation = async () => {
    const response = await infApi(props.employee.ID);
    if (response.length) {
      setInf(response[0]);
    } else setInf(null);
  };
  useEffect(() => {
    getInformation();
  }, []);
  return (
    <>
      {inf ? (
        <div className='employee-inf'>
          <p>
            Mail: <i>{inf.Mail}</i>
          </p>
          <p>
            Nr telefonu: <i>{inf.NrTelefonu}</i>
          </p>
          <p>
            Przełożony:{" "}
            <i>
              {inf.PrzelozonyImie} {inf.PrzelozonyNazwisko}
            </i>
          </p>
          <p></p>
          <p></p>
          <Button
            variant='outline-secondary'
            className='edit-btn'
            onClick={() => setShow(true)}>
            <i className='bi bi-pencil-square'></i> Edytuj
          </Button>
          <FormPopUp show={show} setShow={setShow} employee={inf} />
        </div>
      ) : (
        <>Brak danych</>
      )}
    </>
  );
};

export default EmployeeInf;
