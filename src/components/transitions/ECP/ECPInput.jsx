import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const ECPInput = (props) => {
  const properHours = calculateHoursWorked(
    props.employee.Od,
    props.employee.Do
  );
  const [Od, setOd] = useState(props.employee.Od);
  const [Do, setDo] = useState(props.employee.Do);
  const [hours, setHours] = useState(properHours);
  const [reason, setReason] = useState(null);

  const changeOd = (event) => {
    setOd(event.target.value);
  };
  const changeDo = (event) => {
    setDo(event.target.value);
  };

  function calculateHoursWorked(start, end) {
    const [startHour, startMinutes] = start.split(":").map(Number);
    const [endHour, endMinutes] = end.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMinutes);
    const endDate = new Date(0, 0, 0, endHour, endMinutes);

    let diff = endDate.getTime() - startDate.getTime();

    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    const hours = diff / (1000 * 60 * 60);

    return hours;
  }

  useEffect(() => {
    const newHours = calculateHoursWorked(Od, Do);
    props.setHours(newHours);
    setHours(newHours);
  }, [Od, Do]);

  useEffect(() => {
    const ecp = {
      employee: props.employee.ID,
      odGodz: Od,
      doGodz: Do,
      iloscGodzin: calculateHoursWorked(Od, Do),
      powod: reason,
    };
    console.log(ecp);
    props.addToECP(ecp);
  }, [hours, reason]);

  useEffect(() => {
    if (hours < properHours) {
      setReason(1);
    }
  }, [hours]);

  return (
    <div className='ECP-input'>
      <FloatingLabel
        controlId='floatingInput'
        label='Od godz:'
        className='mb-2'>
        <Form.Control type='time' value={Od} onChange={changeOd} />
      </FloatingLabel>
      <FloatingLabel controlId='floatingPassword' label='Do godz:'>
        <Form.Control type='time' value={Do} onChange={changeDo} />
      </FloatingLabel>
    </div>
  );
};

export default ECPInput;
