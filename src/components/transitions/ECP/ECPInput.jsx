import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import calculateHoursWorked from "./scripts";
import { checkECPForEmployeeOnDate } from "../../../api/ecpApi";
import { useGetData } from "./ECPDataContext";
import { useAuth } from "../Login/AuthContext";

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

  const toggleCheckBox = (event) => {
    if (event.target.checked) {
      let reason = importECP.reason;
      setECPStates(`00:00`, `00:00`, 0, reason);
    } else {
      setECPStates(
        importECP.Od,
        importECP.Do,
        importECP.hours,
        importECP.reason
      );
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
    if (newHours < properHours) {
      setReason(1);
    } else {
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
            controlId='floatingInput'
            label='Od godz:'
            className='mb-2'>
            <Form.Control
              type='time'
              value={Od}
              onChange={changeValue(setOd)}
              disabled={checked}
            />
          </FloatingLabel>
          <FloatingLabel controlId='floatingPassword' label='Do godz:'>
            <Form.Control
              type='time'
              value={Do}
              onChange={changeValue(setDo)}
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
