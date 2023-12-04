import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import calculateHoursWorked from "./scripts";
import { checkECPForEmployeeOnDate } from "../../../api/ecpApi";
import { useGetData } from "./ECPDataContext";
import { useAuth } from "../Login/AuthContext";
import isWeekend from "date-fns/isWeekend";

const ECPInput = (props) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const { employee, hours, setHours, reasons, date, properHours } = props;
  const { addCollector, removeCollector } = useGetData();
  const [Od, setOd] = useState(employee.Od);
  const [Do, setDo] = useState(employee.Do);
  const [reason, setReason] = useState(null);
  const [importECP, setImportECP] = useState({
    Od: employee.Od,
    Do: employee.Do,
    hours: properHours,
    reason: null,
  });
  const [checked, setChecked] = useState(false);

  const setECPStates = (Od, Do, hours, reason) => {
    setReason(reason);
    setOd(Od);
    setDo(Do);
    setHours(hours);
  };

  const setStartData = (Od, Do, hours, reason) => {
    setECPStates(Od, Do, hours, reason);
    setImportECP({ Od: Od, Do: Do, hours: hours, reason: reason });
  };

  const changeValue = (setter) => (event) => setter(event.target.value);

  const roundToNearest15Min = (setter) => (event) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    const roundedMinutes = 15 * Math.round(minutes / 15);
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = roundedMinutes.toString().padStart(2, "0");
    event.target.value = `${formattedHours}:${formattedMinutes}`;
    setter(event.target.value);
  };

  const toggleCheckBox = (event) => {
    if (event.target.checked) {
      if (importECP.hours === 0) {
        let reason = importECP.reason;
        setECPStates(importECP.Od, importECP.Do, importECP.hours, reason);
      } else {
        let reason = importECP.reason;
        setECPStates(`00:00`, `00:00`, 0, reason);
      }
    } else {
      if (importECP.hours > 0 && importECP.hours < 8) {
        setECPStates(importECP.Od, importECP.Do, importECP.hours, reason);
      } else setECPStates(employee.Od, employee.Do, properHours, null);
    }
    setChecked(!checked);
  };

  const checkECP = async () => {
    try {
      const data = await checkECPForEmployeeOnDate(employee.ID, date);
      if (data) {
        setStartData(
          data.Od_godz,
          data.Do_godz,
          data.IloscGodzin,
          data.Powod_ID
        );
        if (data.IloscGodzin === 0) {
          setChecked(true);
        } else {
          setChecked(false);
        }
      } else {
        setStartData(employee.Od, employee.Do, properHours, null);
        setChecked(false);
      }
    } catch (error) {
      setShowPopUpLogout(true);
      setMessage(error.message);
      console.error("Błąd podczas sprawdzania ECP:", error.message);
    }
  };

  useEffect(() => {
    const newHours = calculateHoursWorked(Od, Do);
    if (
      newHours < properHours &&
      reason === null &&
      !isWeekend(new Date(date))
    ) {
      setReason(1);
    } else if (!checked && newHours >= properHours) {
      setReason(null);
    }
    setHours(newHours);
  }, [Od, Do]);

  useEffect(() => {
    const collector = () => ({
      employeeID: employee.ID,
      Od_Godz: Od,
      Do_Godz: Do,
      hours: hours,
      reason: reason,
      date: date,
    });
    addCollector(collector);
    return () => {
      removeCollector(collector);
    };
  }, [hours, reason]);

  useEffect(() => {
    checkECP();
  }, [date]);

  return (
    <>
      <Form.Check
        type='checkbox'
        id={`default-checkbox`}
        label={`Nieobecny cały dzień`}
        className='text-start'
        onChange={toggleCheckBox}
        checked={checked}
      />
      <div className='ECP-input'>
        <div className='ECP-input__time'>
          <FloatingLabel
            controlId='floatingInputOd'
            label='Od godz:'
            className='mb-2'>
            <Form.Control
              type='time'
              value={Od}
              onChange={roundToNearest15Min(setOd)}
              disabled={checked}
            />
          </FloatingLabel>
          <FloatingLabel controlId='floatingInputDo' label='Do godz:'>
            <Form.Control
              type='time'
              value={Do}
              onChange={roundToNearest15Min(setDo)}
              disabled={checked}
            />
          </FloatingLabel>
        </div>

        {reason && reasons ? (
          <div className='ECP-input__reason'>
            <Form.Select onChange={changeValue(setReason)} value={reason}>
              {reasons.map((reason) => (
                <option key={reason.ID} value={reason.ID}>
                  {reason.Nazwa}
                </option>
              ))}
            </Form.Select>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ECPInput;
