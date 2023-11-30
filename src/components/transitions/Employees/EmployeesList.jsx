import React, { useState, useEffect, useCallback } from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import RenderChildren from "../../common/RenderChildren";

const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;
  const [departmentsWithItems, setDepartmentsWithItems] = useState({});

  const handleItemRendered = useCallback((department, hasItems) => {
    console.log("wywoluje");
    setDepartmentsWithItems((prev) => ({
      ...prev,
      [department]: prev[department] || hasItems,
    }));
  }, []);

  useEffect(() => {
    if (dzial !== "Każdy") {
      setDepartmentsWithItems({ [dzial]: true });
    } else if (typeof subordinates === "object") {
      Object.keys(subordinates).forEach((dept) => {
        setDepartmentsWithItems((prev) => ({ ...prev, [dept]: false }));
      });
    }
  }, [dzial, subordinates]);

  const renderEmployees = (employees, dept) => {
    if (employees.length === 0) {
      return null;
    }

    return (
      <Accordion defaultActiveKey='0'>
        <RenderChildren>
          {employees.map((employee, index) => (
            <EmployeeListItem
              employee={employee}
              date={date}
              key={`${dept}-${index}`}
              showWorkedHours={showWorkedHours}
              onItemRendered={handleItemRendered}>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { employee: employee });
                }
                return child;
              })}
            </EmployeeListItem>
          ))}
        </RenderChildren>
      </Accordion>
    );
  };

  const renderDepartment = (department, employees) => {
    if (departmentsWithItems[department] === false) {
      return null;
    }
    return (
      <Accordion.Item eventKey={department} key={department}>
        <Accordion.Header>{department}</Accordion.Header>
        <Accordion.Body>
          {renderEmployees(employees, department)}
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  return (
    <Accordion className='scroll'>
      {dzial === "Każdy" ? (
        typeof subordinates === "object" ? (
          Object.entries(subordinates).map(([dept, employees]) =>
            renderDepartment(dept, employees)
          )
        ) : (
          <div className='no-data-message'>Brak danych</div>
        )
      ) : Array.isArray(subordinates) && subordinates.length > 0 ? (
        renderEmployees(subordinates, dzial)
      ) : (
        <div className='no-data-message'>Brak danych</div>
      )}
    </Accordion>
  );
});

export default EmployeesList;
