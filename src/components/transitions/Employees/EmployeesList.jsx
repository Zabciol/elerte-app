import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import RenderChildren from "../../common/RenderChildren";

const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;

  const renderEmployees = (employees, dept) => {
    // ... (istniejąca logika tworzenia employeeItems)
    return employees.map((employee, index) => (
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
  };
  const renderDepartment = (department, employees) => {
    const departmentContent = renderEmployees(employees, department);

    const shouldRenderDepartment = departmentContent.some((item) => {
      // Konwersja dzieci na tablicę
      const childrenArray = React.Children.toArray(item.props.children);
      console.log(childrenArray);
      // Sprawdź, czy jakiekolwiek dziecko nie jest specjalnym divem z atrybutem 'data-should-not-render'
      return childrenArray.some((child) => {
        return !(
          child.type === "div" &&
          child.props &&
          child.props["data-should-not-render"]
        );
      });
    });

    if (!shouldRenderDepartment) {
      return null; // Jeśli wszystkie elementy to specjalne divy, nie renderuj działu
    }

    // Normalne renderowanie działu
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
