import React, { useEffect, useState } from "react";
import { allEmployees } from "../../../../api/employeesApi";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { departmentsApi } from "../../../../api/departmentsApi";

const SubordinatesForm = (props) => {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const save = () => {
    console.log(props.subordinates);
    props.action();
  };
  const onChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  const filterEmployees = () => {
    if (employees.length) {
      const tab = employees.filter((employee) => employee.Dzial === department);

      setFilteredEmployees(tab);
      console.log(tab);
    }
  };

  const getAllEmployees = async () => {
    const data = await allEmployees();
    console.log(data);
    setEmployees(data);
  };

  const getAllDepartments = async () => {
    const data = await departmentsApi();
    console.log(data);
    setDepartments(data);
  };

  useEffect(() => {
    getAllEmployees();
    getAllDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      const department = departments.filter(
        (department) => department.ID === props.department
      );
      console.log(department[0]);
      setDepartment(department[0].Nazwa);
      filterEmployees();
    }
  }, [props.department, department, departments, employees]);

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
                onClick={() => {
                  const updated = [...props.subordinates];
                  if (!props.subordinates.includes(employee.ID)) {
                    updated.push(employee.ID);
                  } else {
                    const index = updated.indexOf(employee.ID);
                    if (index > -1) updated.splice(index, 1);
                  }

                  props.setSubordinates(updated);
                }}>
                <div className='ms-2 me-auto text-start'>
                  <div className='fw-bold'>
                    {employee.Imie} {employee.Nazwisko}
                  </div>
                  {employee.Dzial}
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
