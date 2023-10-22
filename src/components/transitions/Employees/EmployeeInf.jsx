import React, { useEffect, useState } from "react";
import { infApi } from "../../../api/employeesApi";
import "../../../styles/Employee.css";

const EmployeeInf = (props) => {
  const [inf, setInf] = useState();
  const getInformation = async () => {
    const response = await infApi(props.employee.ID);
    if (response.length) {
      setInf(response[0]);
    } else setInf(null);
  };
  useEffect(() => {
    getInformation();
  }, []);
  console.log(inf);
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
        </div>
      ) : (
        <>Brak danych</>
      )}
    </>
  );
};

export default EmployeeInf;
