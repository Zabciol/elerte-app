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
      await exportECPAPI(props.date, employeesID, props.dzial);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    let IDs;

    if (Array.isArray(props.subordinates)) {
      // Jeśli subordinates jest tablicą
      IDs = props.subordinates.map((employee) => employee.ID);
    } else if (typeof props.subordinates === "object") {
      // Jeśli subordinates jest obiektem (działy)
      IDs = Object.values(props.subordinates)
        .flat()
        .map((employee) => employee.ID);
    } else {
      // W przypadku, gdy subordinates jest innego typu lub nie jest zdefiniowane
      IDs = [];
    }

    setEmployeesID(IDs);
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
