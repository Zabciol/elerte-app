import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import calculateHoursWorked from "./scripts";
import Badge from "react-bootstrap/Badge";

const ECPInput = (props) => {
  const properHours = calculateHoursWorked(
    props.employee.Od,
    props.employee.Do
  );
  const [Od, setOd] = useState(props.employee.Od);
  const [Do, setDo] = useState(props.employee.Do);
  const [hours, setHours] = useState(properHours);
  const [reason, setReason] = useState(null);

  const changeValue = (setter) => (event) => setter(event.target.value);

  const changeReason = (event) => {
    setReason(event.target.value);
  };

  useEffect(() => {
    const newHours = calculateHoursWorked(Od, Do);
    setHours(newHours);
    props.setHours(newHours);
  }, [Od, Do]);

  useEffect(() => {
    const ecp = {
      employee: props.employee.ID,
      odGodz: Od,
      doGodz: Do,
      iloscGodzin: calculateHoursWorked(Od, Do),
      powod: reason,
      data: props.date,
    };

    props.addToECP(ecp);
  }, [hours, reason, props.date]);

  useEffect(() => {
    if (hours < properHours) {
      setReason("1");
    } else {
      setReason(null);
    }
  }, [hours]);

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
          <Form.Select onChange={changeReason}>
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
