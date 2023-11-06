import React, { useEffect, useState } from "react";
import { allEmployeesAPI } from "../../../api/employeesApi";

const ExportExcel = (props) => {
  const [employees, setEmployees] = useState(props.subordinates);

  const getAllEmployees = async () => {
    const data = await allEmployeesAPI();
    console.log(data);
    setEmployees(data);
  };

  useEffect(() => {
    if (props.user.Dzial === "Księgowość" || props.user.Dzial === "Analityka") {
      getAllEmployees();
    }
  }, []);
  return <div>ExportExcel</div>;
};

export default ExportExcel;
