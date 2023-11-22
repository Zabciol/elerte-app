import React, { useEffect, useState, useCallback, useMemo } from "react";
import { allEmployeesAPI } from "../../../../api/employeesApi";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { departmentsApi } from "../../../../api/departmentsApi";
import { mySupervisorsAPI } from "../../../../api/employeesApi";
import { useAuth } from "../../Login/AuthContext";
import { subordinatesApi } from "../../../../api/employeesApi";

const SubordinatesForm = (props) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const onChangeDepartment = useCallback((event) => {
    setDepartment(event.target.value);
  }, []);

  const filterEmployees = useCallback(() => {
    if (employees.length && department) {
      const tab = employees.filter(
        (employee) =>
          employee.Dzial === department &&
          !supervisors.some((supervisor) => supervisor.ID === employee.ID)
      );
      console.log(tab);
      setFilteredEmployees(tab);
    }
  }, [employees, department, supervisors]);

  const getAllEmployees = useCallback(async () => {
    try {
      let data = await allEmployeesAPI();
      if (props.employee) {
        data = data.filter((employee) => employee.ID !== props.employee.ID);
      }
      setEmployees(data);
      const supervisorsData = await mySupervisorsAPI(props.employee.ID);
      console.log("Moi przełozeni: ", supervisorsData);
      setSupervisors(supervisorsData.data.length ? supervisorsData.data : []);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  }, [props.employee, setMessage, setShowPopUpLogout]);

  const getAllDepartments = useCallback(async () => {
    try {
      const data = await departmentsApi();
      setDepartments(data);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  }, [setMessage, setShowPopUpLogout]);

  const updateHierarchy = useCallback(
    (employee) => {
      const directSubordinates = props.directSubordinates.filter(
        (id) => id !== employee.ID
      );
      const allSubordinates = props.subordinates.filter(
        (id) => id !== employee.ID
      );

      if (!props.subordinates.includes(employee.ID)) {
        directSubordinates.push(employee.ID);
        allSubordinates.push(employee.ID);
      }

      props.updateData(directSubordinates, allSubordinates);
    },
    [props]
  );

  useEffect(() => {
    getAllEmployees();
    getAllDepartments();
  }, [getAllEmployees, getAllDepartments, props.employee]);

  useEffect(() => {
    filterEmployees();
  }, [filterEmployees, employees, department]);

  useEffect(() => {
    if (departments.length > 0) {
      const dep = departments.find(
        (department) => department.ID === Number(props.department)
      );
      setDepartment(dep ? dep.Nazwa : null);
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
