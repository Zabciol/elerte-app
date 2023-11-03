import React, { useState, useEffect } from "react";
import { supervisorsApi } from "../../../../api/employeesApi";
import { departmentsApi } from "../../../../api/departmentsApi";
import { positionApi } from "../../../../api/positionApi";
import { workingTimeApi } from "../../../../api/workingTimeApi";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const PositionForm = ({ employee }) => {
  console.log(employee);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [supervisor, setSupervisor] = useState("");
  const [workingTimes, setWorkingTimes] = useState([]);
  const [workingTime, setWorkingTime] = useState("");

  const onChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };
  const onChangePosition = (event) => {
    setPosition(event.target.value);
  };
  const onChangeSupervisor = (event) => {
    setSupervisor(event.target.value);
  };
  const onChangeWorkingTime = (event) => {
    setWorkingTime(event.target.value);
  };

  const getFromApi = async (setStateTab, api, value) => {
    value === undefined
      ? setStateTab(await api())
      : setStateTab(await api(value));
  };
  useEffect(() => {
    getFromApi(setDepartments, departmentsApi);
    getFromApi(setSupervisors, supervisorsApi);
    getFromApi(setWorkingTimes, workingTimeApi);

    if (employee) {
      // Ustaw wartość początkową dla działu bazując na danych pracownika
      setDepartment(employee.DzialID);

      // Ustaw wartość początkową dla przełożonego bazując na danych pracownika
      setSupervisor(employee.PrzelozonyID);
    }
  }, []);

  useEffect(() => {
    department !== ""
      ? getFromApi(setPositions, positionApi, department)
      : getFromApi(setPositions, positionApi, 1);
  }, [department]);

  return (
    <>
      <FloatingLabel controlId='floatingSelect' label='Dział'>
        <Form.Select
          value={department}
          aria-label='Floating label select example'
          onChange={onChangeDepartment}>
          {departments.map((department) => (
            <option value={department} key={department.ID}>
              {department.Nazwa}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='floatingSelect' label='Stanowisko'>
        <Form.Select
          aria-label='Floating label select example'
          onChange={onChangePosition}>
          {positions.map((position) => (
            <option value={position.ID} key={position.ID}>
              {position.Nazwa}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='floatingSelect' label='Przełozony'>
        <Form.Select
          value={supervisor}
          aria-label='Floating label select example'
          onChange={onChangeSupervisor}>
          {supervisors.map((supervisor) => (
            <option value={supervisor.ID} key={supervisor.ID}>
              {supervisor.Imie +
                " " +
                supervisor.Nazwisko +
                " - " +
                supervisor.Nazwa}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='floatingSelect' label='Czas pracy'>
        <Form.Select
          aria-label='Floating label select example'
          onChange={onChangeWorkingTime}>
          {workingTimes.map((workingTime) => (
            <option value={workingTime} key={workingTime.ID}>
              {workingTime.Od + " - " + workingTime.Do}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    </>
  );
};

export default PositionForm;
