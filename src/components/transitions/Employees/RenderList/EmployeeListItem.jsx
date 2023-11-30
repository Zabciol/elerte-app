import React, { Children, useState } from "react";
import UserCard from "../../../common/UserCard";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import { useEffect } from "react";
import { hoursWorkedApi } from "../../../../api/employeesApi";
import { getAbsenceCountAPI } from "../../../../api/ecpApi";
import { useAuth } from "../../Login/AuthContext";

const EmployeeListItem = React.memo(
  ({ employee, date, children, showWorkedHours, setShouldRender }) => {
    const [workedHours, setWorkedHours] = useState(0);

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

    useEffect(() => {
      if (workedHours > 0 || showWorkedHours) {
        console.log("Powinno pokazać");
        setShouldRender(true);
      } else setShouldRender(false);
    }, [workedHours, setShouldRender, employee]);

    return (
      <>
        {showWorkedHours || workedHours ? (
          <UserCard employee={employee} inf={workedHours}>
            {children}
          </UserCard>
        ) : null}
      </>
    );
  }
);

export default EmployeeListItem;
