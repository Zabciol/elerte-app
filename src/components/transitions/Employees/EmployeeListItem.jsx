import React, { Children, useState } from "react";
import UserCard from "../../common/UserCard";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import { useEffect } from "react";
import { hoursWorkedApi } from "../../../api/employeesApi";
import { getAbsenceCountAPI } from "../../../api/ecpApi";
import { useAuth } from "../Login/AuthContext";

const EmployeeListItem = React.memo(
  ({ employee, date, children, showWorkedHours }) => {
    const [workedHours, setWorkedHours] = useState(null);
    const { setShowPopUpLogout, setMessage } = useAuth();
    const getWorkedHours = async () => {
      if (employee.ID && date) {
        try {
          const response = showWorkedHours
            ? await hoursWorkedApi(employee.ID, date)
            : await getAbsenceCountAPI(employee.ID, date);
          if (response.length) {
            setWorkedHours(response[0].SumaGodzin);
          } else setWorkedHours(0);
        } catch (error) {
          console.error(error);
          setMessage(error.message);
          setShowPopUpLogout(true);
        }
      }
    };

    useEffect(() => {
      getWorkedHours();
    }, [date, employee]);
    const employeeEventKey = `emp-${employee.ID}`;

    return (
      <Accordion.Item eventKey={employeeEventKey}>
        <Accordion.Header>
          <div className='d-flex w-100 pt-1 pe-2 justify-content-between'>
            <div className='ms-2 me-auto'>
              <div className='fw-bold'>{`${employee.Imie} ${employee.Nazwisko}`}</div>
              {employee.Stanowisko}
            </div>
            {workedHours !== null ? <Badge>{workedHours}</Badge> : null}
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <div style={{ overflow: "hidden" }}>{children}</div>
        </Accordion.Body>
      </Accordion.Item>
    );
  }
);

export default EmployeeListItem;
