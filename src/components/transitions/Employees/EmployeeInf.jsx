import React, { useEffect, useState } from "react";
import { getInf } from "../../../api/employeesApi";

const EmployeeInf = (props) => {
  const [inf, setInf] = useState();
  const getInformation = async () => {
    const response = await getInf(props.employee.ID);
    console.log(response);
    if (response.length) {
      console.log(response);
      //setInf(response);
    } else setInf(null);
  };
  useEffect(() => {
    console.log(props);
    getInformation();
  }, []);
  console.log(inf);
  return <div>EmployeeInf</div>;
};

export default EmployeeInf;
