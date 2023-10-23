import React, { useEffect, useState } from "react";
import { allEmployees } from "../../../../api/employeesApi";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

const NewEmployeeSubordinates = (props) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const save = () => {
    console.log(props.subordinates);
    props.action();
  };

  const filterEmployees = () => {
    if (employees.length) {
      const tab =
        props.dzial === "Każdy"
          ? employees
          : employees.filter((employee) => employee.Dzial === props.dzial);
      setFilteredEmployees(tab);
      console.log(tab);
    }
  };

  const getAllEmployees = async () => {
    const data = await allEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [props.dzial, employees]);

  return (
    <>
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
      <Button variant='primary' className='add-new-employee-btn' onClick={save}>
        Zapisz
      </Button>{" "}
    </>
  );
};

export default NewEmployeeSubordinates;
