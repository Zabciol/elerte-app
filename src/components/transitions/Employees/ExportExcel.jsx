import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { allEmployeesAPI } from "../../../api/employeesApi";
import { exportECPAPI } from "../../../api/ecpApi";

const ExportExcel = (props) => {
  const [employeesID, setEmployeesID] = useState([]);

  const download = async () => {
    await exportECPAPI(props.date, employeesID);
  };

  const getAllEmployees = async () => {
    const data = await allEmployeesAPI();
    setEmployeesID(data.map((employee) => employee.ID));
  };

  useEffect(() => {
    if (
      props.user.Dzial === "Księgowość" ||
      props.user.Dzial === "Analityka" ||
      props.user.Dzial === "Dyrekcja"
    ) {
      getAllEmployees();
    } else {
      const IDs = props.subordinates.map((employee) => employee.ID);
      setEmployeesID(IDs);
    }
  }, [props]);
  return (
    <div>
      <Button variant='primary' onClick={download}>
        Primary
      </Button>
    </div>
  );
};

export default ExportExcel;
