import React, { useState, useEffect } from "react";
import { supervisorsApi } from "../../../../api/employeesApi";
import { departmentsApi } from "../../../../api/departmentsApi";
import { positionApi } from "../../../../api/positionApi";
import { workingTimeApi } from "../../../../api/workingTimeApi";
import { subordinatesApi } from "../../../../api/employeesApi";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useAuth } from "../../Login/AuthContext";

const PositionForm = (props) => {
  const {
    employee,
    department,
    setDepartment,
    position,
    setPosition,
    supervisor,
    setSupervisor,
    subordinates,
    workingTime,
    setWorkingTime,
  } = props;

  const { setShowPopUpLogout, setMessage } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [workingTimes, setWorkingTimes] = useState([]);

  const onChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };
  const onChangePosition = (event) => {
    setPosition(event.target.value);
  };
  const onChangeSupervisor = (event) => {
    console.log(event.target.value);
    setSupervisor(event.target.value);
  };
  const onChangeWorkingTime = (event) => {
    setWorkingTime(event.target.value);
  };

  const getFromApi = async (setStateTab, api, value) => {
    try {
      value === undefined
        ? setStateTab(await api())
        : setStateTab(await api(value));
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getSupervisors = async () => {
    try {
      const data = await supervisorsApi();
      let newTab = data.filter(
        (supervisor) => !subordinates.includes(supervisor.ID)
      );
      if (employee.ID !== 1) {
        newTab = newTab.filter((supervisor) => supervisor.ID !== employee.ID);
      }
      if (employee.PrzelozonyID === null) {
        const supervisorsInSpecificDepartment = newTab.filter(
          (supervisor) => supervisor.Dzial_ID === department
        );
        if (supervisorsInSpecificDepartment.length)
          setSupervisor(supervisorsInSpecificDepartment[0].ID);
      }
      setSupervisors(newTab);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    getFromApi(setDepartments, departmentsApi);
    getFromApi(setWorkingTimes, workingTimeApi);
    if (employee) {
      setDepartment(employee.DzialID);
      setPosition(employee.StanowiskoID);
      setWorkingTime(employee.WymiarPracy_ID);
      setSupervisor(employee.PrzelozonyID);
    } else {
      setDepartment(departments[2].ID);
    }
  }, [subordinates]);

  useEffect(() => {
    getSupervisors();
    department !== undefined
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
            <option value={department.ID} key={department.ID}>
              {department.Nazwa}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='floatingSelect' label='Stanowisko'>
        <Form.Select
          value={position}
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
          value={supervisor || employee.ID}
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
          value={workingTime}
          aria-label='Floating label select example'
          onChange={onChangeWorkingTime}>
          {workingTimes.map((workingTime) => (
            <option value={workingTime.ID} key={workingTime.ID}>
              {workingTime.Od + " - " + workingTime.Do}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    </>
  );
};

export default PositionForm;
