import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./EmployeeListItem";
import RenderChildren from "../../common/RenderChildren";

const EmployeesList = React.memo((props) => {
  const { subordinates, date, children, showWorkedHours, dzial } = props;

  const RenderChildren = ({
    children,
    employee,
    date,
    key,
    showWorkedHours,
  }) => {
    let hasValidChildren = false;
    const childrenComponents = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        hasValidChildren = true;
        return React.cloneElement(child, { employee: employee });
      }
      console.log("dzieci są null");
      return null;
    });

    return hasValidChildren ? childrenComponents : null;
  };

  const renderEmployees = (employees, dept, children) => {
    return employees
      .map((employee, index) => {
        const childrenComponents = RenderChildren({
          children,
          employee,
          date,
          key: `${dept}-${index}`,
          showWorkedHours,
        });

        if (childrenComponents) {
          return (
            <EmployeeListItem
              employee={employee}
              date={date}
              key={`${dept}-${index}`}
              showWorkedHours={showWorkedHours}>
              {childrenComponents}
            </EmployeeListItem>
          );
        }

        return null;
      })
      .filter((item) => item !== null); // Filtruje pracowników, którzy nie mają ważnych dzieci
  };

  const renderDepartment = (department, employees, children) => {
    const departmentContent = renderEmployees(employees, department, children);

    if (departmentContent.length === 0) return null;

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
