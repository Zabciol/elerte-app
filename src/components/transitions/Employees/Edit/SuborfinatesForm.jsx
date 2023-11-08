import React, { useEffect, useState } from "react";
import { allEmployeesAPI } from "../../../../api/employeesApi";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { departmentsApi } from "../../../../api/departmentsApi";
import { mySupervisorsAPI } from "../../../../api/employeesApi";
import { myDirectSubordinatesAPI } from "../../../../api/employeesApi";

const SubordinatesForm = (props) => {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const onChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  const filterEmployees = () => {
    if (employees.length && department) {
      const tab = employees
        .filter((employee) => employee.Dzial === department)
        .filter(
          (employee) =>
            !supervisors.some((supervisor) => supervisor.ID === employee.ID)
        );
      console.log("Przefiltrowani mozliwi podwładni");
      console.log(tab);
      setFilteredEmployees(tab);
    }
  };

  const getAllEmployees = async () => {
    let data = await allEmployeesAPI();
    if (props.employee) {
      data = data.filter((employee) => employee.ID !== props.employee.ID);
    }
    setEmployees(data);
    const supervisorsData = await mySupervisorsAPI(props.employee.ID);
    console.log("Przełozeni tego pracownika:");
    console.log(supervisorsData.message);
    if (supervisorsData.data.length) {
      console.log(supervisorsData.data);
      setSupervisors(supervisorsData.data);
    }
  };

  const getAllDepartments = async () => {
    const data = await departmentsApi();
    setDepartments(data);
  };

  const updateHierarchy = (employee) => {
    const directSubordinates = [...props.directSubordinates];
    const allSubordinates = [...props.subordinates];

    if (
      !props.subordinates.includes(employee.ID) &&
      !props.directSubordinates.includes(employee.ID)
    ) {
      directSubordinates.push(employee.ID);
      allSubordinates.push(employee.ID);
    } else if (
      props.subordinates.includes(employee.ID) &&
      props.directSubordinates.includes(employee.ID)
    ) {
      const index = directSubordinates.indexOf(employee.ID);
      if (index > -1) directSubordinates.splice(index, 1);
      const index2 = allSubordinates.indexOf(employee.ID);
      if (index2 > -1) allSubordinates.splice(index2, 1);
    }
    props.updateData(directSubordinates);
  };
  useEffect(() => {
    const fetchData = async () => {
      await getAllEmployees();
      await getAllDepartments();
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [department, employees]);

  useEffect(() => {
    if (departments && departments.length > 0) {
      const dep = departments.filter(
        (department) => department.ID === Number(props.department)
      );
      setDepartment(dep[0].Nazwa);
    }
  }, [props.department, departments]);

  return (
    <>
      <FloatingLabel controlId='floatingSelect' label='Dział'>
        <Form.Select
          value={department}
          aria-label='Floating label select example'
          onChange={onChangeDepartment}>
          {departments.map((department) => (
            <option value={department.Nazwa} key={department.ID}>
              {department.Nazwa}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
      <ListGroup as='ol' numbered className='scroll'>
        {filteredEmployees.length
          ? filteredEmployees.map((employee) => (
              <ListGroup.Item
                key={employee.ID}
                as='li'
                className='d-flex justify-content-between align-items-start'
                onClick={() => updateHierarchy(employee)}>
                <div className='ms-2 me-auto text-start'>
                  <div className='fw-bold'>
                    {employee.Imie} {employee.Nazwisko}
                  </div>
                  {employee.Stanowisko}
                </div>

                <input
                  type='checkbox'
                  value={employee.ID}
                  checked={props.subordinates.includes(employee.ID)}
                  onChange={(e) => {
                    e.stopPropagation();
                  }}
                />
              </ListGroup.Item>
            ))
          : null}
      </ListGroup>
    </>
  );
};

export default SubordinatesForm;
