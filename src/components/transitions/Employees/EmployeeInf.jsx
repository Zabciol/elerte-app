import React, { useEffect, useState } from "react";
import { getInf } from "../../../api/employeesApi";

const EmployeeInf = (props) => {
  const [inf, setInf] = useState();
  const getInformation = async () => {
    const response = await getInf(props.employee.ID);
    if (response.length) {
      setInf(response[0]);
    } else setInf(null);
  };
  useEffect(() => {
    getInformation();
  }, []);
  console.log(inf);
  return <div>{inf ? <>{inf.Imie}</> : <>Brak danych</>}</div>;
};

export default EmployeeInf;
