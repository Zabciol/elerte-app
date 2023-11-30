import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import RenderChildren from "../../common/RenderChildren";

const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;

  const renderEmployees = (employees, dept) => {
    const employeeItems = employees.map((employee, index) => (
      <EmployeeListItem
        employee={employee}
        date={date}
        key={`${dept}-${index}`}
        showWorkedHours={showWorkedHours}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { employee: employee });
          }
          return child;
        })}
      </EmployeeListItem>
    ));

    // Filtruj puste elementy
    const nonEmptyEmployeeItems = employeeItems.filter((item) => !!item);

    return nonEmptyEmployeeItems;
  };

  const renderDepartment = (department, employees) => {
    const departmentContent = renderEmployees(employees, department);

    const hasNonEmptyContent = departmentContent.some((item) => !!item);

    if (!hasNonEmptyContent) {
      return null; // Jeśli nie ma niepustych elementów, nie renderuj department
    }
    return (
      <Accordion.Item eventKey={department} key={department}>
        <Accordion.Header>{department}</Accordion.Header>
        <Accordion.Body>
          <Accordion defaultActiveKey='0'>{departmentContent}</Accordion>
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
