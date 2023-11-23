import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FormPopUp from "./Edit/FormPopUp";
import { infApi } from "../../../api/employeesApi";
import "../../../styles/Employee.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../Login/AuthContext";

const EmployeeInf = React.memo((props) => {
  const [inf, setInf] = useState();
  const [show, setShow] = useState(false);
  const { setShowPopUpLogout, setMessage } = useAuth();
  const getInformation = async () => {
    try {
      const response = await infApi(props.employee.ID);
      if (response) {
        setInf(response);
      } else setInf(null);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
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
            Przełożeni:{" "}
            {inf.przelozeni.map((supervisor) =>
              supervisor.ID ? (
                <i key={supervisor.ID}>
                  {supervisor.Imie + " " + supervisor.Nazwisko + " "}
                </i>
              ) : null
            )}
            <i>
              {inf.PrzelozonyImie} {inf.PrzelozonyNazwisko}
            </i>
          </p>
          <p></p>
          <p></p>
          <Button
            disabled={
              !(props.user.Uprawnienia === 3 || props.user.Uprawnienia === 4)
            }
            variant='outline-secondary'
            className='edit-btn'
            onClick={() => setShow(true)}>
            <i className='bi bi-pencil-square'></i> Edytuj
          </Button>

          <FormPopUp
            show={show}
            setShow={setShow}
            employee={inf}
            user={props.user}
          />
        </div>
      ) : (
        <>Brak danych</>
      )}
    </>
  );
});

export default EmployeeInf;
