import React, { useMemo, useState, useCallback } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";

const Department = ({
  department,
  employees,
  date,
  children,
  showWorkedHours,
}) => {
  const [shouldRender, setShouldRender] = useState(true);

  const handleWorkedHoursChange = useCallback((hasWorkedHours) => {
    setShouldRender(hasWorkedHours);
  }, []);

  const employeeElements = useMemo(() => {
    return employees.map((employee, index) => (
      <EmployeeListItem
        key={`${department}-${index}`}
        employee={employee}
        date={date}
        showWorkedHours={showWorkedHours}
        setShouldRender={handleWorkedHoursChange}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { employee: employee });
          }
          return child;
        })}
      </EmployeeListItem>
    ));
  }, [employees, date, showWorkedHours, children]);

  return (
    <>
      {" "}
      {shouldRender ? (
        <Accordion.Item eventKey={department}>
          <Accordion.Header>{department}</Accordion.Header>
          <Accordion.Body>
            <Accordion defaultActiveKey='0'>{employeeElements}</Accordion>
          </Accordion.Body>
        </Accordion.Item>
      ) : null}
    </>
  );
};

export default Department;
