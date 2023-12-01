import React, { Children, useEffect, useState } from "react";
import RenderEmployees from "./RenderEmployees";
import EmployeeListItem from "../EmployeeListItem";
import { showDepartmentAPI } from "../../../../api/departmentsApi";
import Accordion from "react-bootstrap/Accordion";
import { useAuth } from "../../Login/AuthContext";
const RenderDepartment = ({
  department,
  employees,
  date,
  showWorkedHours,
  children,
}) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [show, setshow] = useState(true);

  const handleShow = async () => {
    try {
      const response = await showDepartmentAPI(department);
      if (!response.success) setshow(false);
      console.log(response);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };
  useEffect(() => {
    console.log(employees);
    console.log(show);
    if (!showWorkedHours) handleShow();
  }, [department, showWorkedHours, employees]);

  return (
    <>
      {" "}
      {show ? (
        <Accordion.Item eventKey={department} key={department}>
          <Accordion.Header>{department}</Accordion.Header>
          <Accordion.Body>
            <Accordion defaultActiveKey='0'>
              <RenderEmployees
                employees={employees}
                department={department}
                showWorkedHours={showWorkedHours}
                date={date}>
                {children}
              </RenderEmployees>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      ) : null}
    </>
  );
};

export default RenderDepartment;
