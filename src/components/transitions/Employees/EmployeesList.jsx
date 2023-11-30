import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import RenderChildren from "../../common/RenderChildren";
const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;

  const renderEmployees = (employees, dept) => {
    return employees
      .map((employee, index) => (
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
      ))
      .filter((item) => !!item); // Filtruj puste elementy
  };

  const renderDepartment = (department, employees) => {
    const departmentContent = renderEmployees(employees, department);

    if (departmentContent.length === 0) {
      return null; // Jeśli w dziale nie ma pracowników, nie renderuj działu
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
          Object.entries(subordinates)
            .map(([dept, employees]) => renderDepartment(dept, employees))
            .filter((department) => department != null) // Filtruj puste działy
        ) : (
          <div className='no-data-message'>Brak danych</div>
        )
      ) : (
        renderDepartment(dzial, subordinates)
      )}
    </Accordion>
  );
});

export default EmployeesList;
