import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
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
    directSupervisors,
    setDirectSupervisors,
    subordinates,
    workingTime,
    setWorkingTime,
  } = props;
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
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

    filteredSupervisors = filteredSupervisors.filter(
      (supervisor) => supervisor.ID !== employee.ID
    );

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
    fetchData(supervisorsApi).then((data) => {
      const filtered = filterSupervisors(data);
      setSupervisors(filtered);

      const initialSupervisors = filtered.filter((supervisor) =>
        directSupervisors.some((ds) => ds.ID === supervisor.ID)
      );

      setSelectedSupervisors(
        initialSupervisors.map((s) => ({
          value: s.ID,
          label: `${s.Imie} ${s.Nazwisko}`,
          ID: s.ID,
          Imie: s.Imie,
          Nazwisko: s.Nazwisko,
        }))
      );
    });
  }, [subordinates, directSupervisors]);

  useEffect(() => {
    setDepartment(department || employee?.DzialID || departments[0]?.ID);
    setPosition(position || employee?.StanowiskoID || positions[0]?.ID);
    setWorkingTime(
      workingTime || employee?.WymiarPracy_ID || workingTimes[0]?.ID
    );
  }, [subordinates, departments, positions, workingTimes, supervisors]);

  const handleSupervisorsChange = (selectedOptions) => {
    setSelectedSupervisors((prevSelected) => selectedOptions);
    setDirectSupervisors((prevDirect) =>
      selectedOptions.map((option) => ({
        ID: option.value, // upewnij się, że używasz właściwego klucza
        Imie: option.Imie, // sprawdź, czy te klucze są poprawne
        Nazwisko: option.Nazwisko,
      }))
    );
  };

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
      <div className='mb-3 select-react-position form-group '>
        <label
          htmlFor='supervisorSelect'
          className='form-label select-react-position-label'>
          Przełożony
        </label>
        <Select
          id='supervisorSelect'
          isMulti
          options={supervisors.map((s) => ({
            value: s.ID,
            label: `${s.Imie} ${s.Nazwisko}`,
            Imie: s.Imie,
            Nazwisko: s.Nazwisko,
          }))}
          value={selectedSupervisors}
          onChange={handleSupervisorsChange}
        />
      </div>
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
