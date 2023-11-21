import React, { useState, useEffect, useCallback } from "react";
import { supervisorsApi } from "../../../../api/employeesApi";
import { departmentsApi } from "../../../../api/departmentsApi";
import { positionApi } from "../../../../api/positionApi";
import { workingTimeApi } from "../../../../api/workingTimeApi";
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

  const onChange = useCallback((event, setter) => {
    setter(event.target.value);
  }, []);

  const fetchData = async (api, args) => {
    try {
      return await api(args);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
      return [];
    }
  };

  const filterSupervisors = (data) => {
    let filteredSupervisors = data.filter(
      (supervisor) => !subordinates.includes(supervisor.ID)
    );
    if (employee.ID !== 1) {
      filteredSupervisors = filteredSupervisors.filter(
        (supervisor) => supervisor.ID !== employee.ID
      );
    }
    return filteredSupervisors;
  };

  useEffect(() => {
    fetchData(departmentsApi).then(setDepartments);
    fetchData(workingTimeApi).then(setWorkingTimes);
  }, []);

  useEffect(() => {
    fetchData(positionApi, department || 1).then(setPositions);
  }, [department]);

  useEffect(() => {
    fetchData(supervisorsApi).then((data) =>
      setSupervisors(filterSupervisors(data))
    );
  }, [subordinates]);

  useEffect(() => {
    setDepartment(employee?.DzialID || departments[2]?.ID);
    setPosition(employee?.StanowiskoID || positions[0]?.ID);
    setWorkingTime(employee?.WymiarPracy_ID || workingTimes[0]?.ID);
    setSupervisor(employee?.PrzelozonyID || supervisors[0]?.ID);
  }, [subordinates]);

  const renderSelect = (label, value, onChange, options, formatOption) => (
    <FloatingLabel controlId={`floatingSelect-${label}`} label={label}>
      <Form.Select
        value={value}
        aria-label={`Floating label select example ${label}`}
        onChange={onChange}>
        {options.map((option, index) => (
          <option value={option.ID} key={option.ID}>
            {formatOption(option)}
          </option>
        ))}
      </Form.Select>
    </FloatingLabel>
  );

  return (
    <>
      {renderSelect(
        "Dział",
        department,
        (e) => onChange(e, setDepartment),
        departments,
        (d) => d.Nazwa
      )}
      {renderSelect(
        "Stanowisko",
        position,
        (e) => onChange(e, setPosition),
        positions,
        (p) => p.Nazwa
      )}
      {renderSelect(
        "Przełożony",
        supervisor || employee.ID,
        (e) => onChange(e, setSupervisor),
        supervisors,
        (s) => `${s.Imie} ${s.Nazwisko} - ${s.Nazwa}`
      )}
      {renderSelect(
        "Czas pracy",
        workingTime,
        (e) => onChange(e, setWorkingTime),
        workingTimes,
        (w) => `${w.Od} - ${w.Do}`
      )}
    </>
  );
};

export default PositionForm;
