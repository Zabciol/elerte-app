import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import RenderChildren from "../../common/RenderChildren";
import { showDepartmentAPI } from "../../../api/departmentsApi";
import RenderDepartment from "./Render/RenderDepartment";
import RenderEmployees from "./Render/RenderEmployees";

const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;

  return (
    <Accordion className='scroll'>
      {dzial === "Każdy" ? (
        typeof subordinates === "object" ? (
          Object.entries(subordinates).map(([dept, employees]) => (
            <RenderDepartment
              department={dept}
              employees={employees}
              showWorkedHours={showWorkedHours}
              key={dept}
              date={date}>
              {children}
            </RenderDepartment>
          ))
        ) : (
          <div className='no-data-message'>Brak danych</div>
        )
      ) : Array.isArray(subordinates) && subordinates.length > 0 ? (
        <RenderEmployees
          employees={subordinates}
          dept={dzial}
          date={date}
          showWorkedHours={showWorkedHours}>
          {children}
        </RenderEmployees>
      ) : (
        <div className='no-data-message'>Brak danych</div>
      )}
    </Accordion>
  );
});

export default EmployeesList;
