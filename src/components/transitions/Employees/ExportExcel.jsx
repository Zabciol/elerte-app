import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { allEmployeesAPI } from "../../../api/employeesApi";
import { exportECPAPI } from "../../../api/ecpApi";
import { useAuth } from "../Login/AuthContext";

const ExportExcel = (props) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [employeesID, setEmployeesID] = useState([]);

  const download = async () => {
    try {
      await exportECPAPI(props.date, employeesID);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getAllEmployees = async () => {
    try {
      const data = await allEmployeesAPI();
      setEmployeesID(data.map((employee) => employee.ID));
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
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
        Pobierz ECP do pliku Excel <i className='bi bi-download'></i>
      </Button>
    </div>
  );
};

export default ExportExcel;
