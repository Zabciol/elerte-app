import React, { Children, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import EmployeeInf from "./EmployeeInf";
const EmployeesList = (props) => {
  const { subordinates, date, children, showWorkedHours } = props;

  return (
    <Accordion className='scroll'>
      {subordinates.length > 0 ? (
        subordinates.map((employee) => (
          <EmployeeListItem
            employee={employee}
            date={date}
            key={employee.ID}
            showWorkedHours={showWorkedHours}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { employee: employee });
              }
              return child;
            })}
          </EmployeeListItem>
        ))
      ) : (
        <div className='no-data-message'>Brak danych</div>
      )}
    </Accordion>
  );
};

export default EmployeesList;
