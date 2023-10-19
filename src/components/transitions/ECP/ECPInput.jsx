import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import calculateHoursWorked from "./scripts";
import Badge from "react-bootstrap/Badge";
import { checkECPForEmployeeOnDate } from "../../../api/ecpApi";
import { useGetData } from "./ECPDataContext";

const ECPInput = (props) => {
  const { addCollector, removeCollector } = useGetData();
  const properHours = calculateHoursWorked(
    props.employee.Od,
    props.employee.Do
  );
  const [Od, setOd] = useState(props.employee.Od);
  const [Do, setDo] = useState(props.employee.Do);
  const [hours, setHours] = useState(properHours);
  const [reason, setReason] = useState(null);

  const setAllStates = (Od, Do, hours, reason) => {
    setOd(Od);
    setDo(Do);
    setHours(hours);
    setReason(reason);
  };

  const changeValue = (setter) => (event) => setter(event.target.value);

  const checkECP = async () => {
    try {
      const data = await checkECPForEmployeeOnDate(
        props.employee.ID,
        props.date
      );
      if (data) {
        setAllStates(
          data.Od_godz,
          data.Do_godz,
          data.IloscGodzin,
          data.Powod_ID
        );
      } else {
        setAllStates(props.employee.Od, props.employee.Do, properHours, null);
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania ECP:", error.message);
    }
  };

  useEffect(() => {
    const newHours = calculateHoursWorked(Od, Do);
    setHours(newHours);
    props.setHours(newHours);
  }, [Od, Do]);

  useEffect(() => {
    const collector = () => ({
      employeeID: props.employee.ID,
      Od_Godz: Od,
      Do_Godz: Do,
      hours: hours,
      reason: reason,
      date: props.date,
    });

    // Register the collector
    addCollector(collector);

    // Unregister on cleanup
    return () => {
      removeCollector(collector);
    };
  }, [hours, reason]);

  useEffect(() => {
    if (hours < properHours) {
      setReason("1");
    } else {
      setReason(null);
    }
  }, [hours]);

  useEffect(() => {
    checkECP();
  }, [props.date]);

  return (
    <div className='ECP-input'>
      <div className='ECP-input__time'>
        <FloatingLabel
          controlId='floatingInput'
          label='Od godz:'
          className='mb-2'>
          <Form.Control type='time' value={Od} onChange={changeValue(setOd)} />
        </FloatingLabel>
        <FloatingLabel controlId='floatingPassword' label='Do godz:'>
          <Form.Control type='time' value={Do} onChange={changeValue(setDo)} />
        </FloatingLabel>
      </div>
      {hours < properHours && props.reasons ? (
        <div className='ECP-input__reason'>
          <Form.Select onChange={changeValue(setReason)}>
            {props.reasons.map((reason) => (
              <option key={reason.ID} value={reason.ID}>
                {reason.Nazwa}
              </option>
            ))}
          </Form.Select>
        </div>
      ) : null}
    </div>
  );
};

export default ECPInput;
