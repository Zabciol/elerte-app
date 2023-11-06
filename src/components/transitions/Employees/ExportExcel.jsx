import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { allEmployeesAPI } from "../../../api/employeesApi";
import { exportECPAPI } from "../../../api/ecpApi";

const ExportExcel = (props) => {
  const [employeesID, setEmployeesID] = useState(
    props.subordinates.map((employee) => employee.ID)
  );

  const download = async () => {
    const result = await exportECPAPI(props.date, employeesID);
    console.log("Pobieranie");
  };

  const getAllEmployees = async () => {
    const data = await allEmployeesAPI();
    console.log(data.map((employee) => employee.ID));
    setEmployeesID(data.map((employee) => employee.ID));
  };

  useEffect(() => {
    if (props.user.Dzial === "Księgowość" || props.user.Dzial === "Analityka") {
      getAllEmployees();
    }
  }, []);
  return (
    <div>
      <Button variant='primary' onClick={download}>
        Primary
      </Button>
    </div>
  );
};

export default ExportExcel;
