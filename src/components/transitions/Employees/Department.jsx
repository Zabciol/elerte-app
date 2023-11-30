import React from "react";
import Accordion from "react-bootstrap/Accordion";
import EmployeeListItem from "./RenderList/EmployeeListItem";

const Department = ({
  departmentName,
  employees,
  date,
  children,
  showWorkedHours,
}) => {
  const renderEmployees = () => {
    return employees.map((employee, index) => (
      <EmployeeListItem
        key={`${departmentName}-${index}`}
        employee={employee}
        date={date}
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

  const departmentContent = renderEmployees();
  const isDepartmentVisible = departmentContent.some(
    (content) => content !== null
  );

  if (!isDepartmentVisible) {
    return null;
  }

  return (
    <Accordion.Item eventKey={departmentName}>
      <Accordion.Header>{departmentName}</Accordion.Header>
      <Accordion.Body>{departmentContent}</Accordion.Body>
    </Accordion.Item>
  );
};

export default Department;
