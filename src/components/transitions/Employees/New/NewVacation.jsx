import React, { useState, useCallback } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const NewVacation = (props) => {
  const {
    pastDays,
    setPastDays,
    usedDays,
    setUsedDays,
    maxCountOfDays,
    setMaxCountOfDays,
  } = props;

  const onChange = useCallback((event, setter) => {
    setter(event.target.value);
  }, []);

  return (
    <div className='d-flex flex-wrap justify-content-center align-items-center w-100'>
      <FloatingLabel
        controlId='usedDays'
        label='Wykorzystane dni urlopu'
        className='m-1 w-auto flex-grow-1'>
        <Form.Control
          value={usedDays}
          type='number'
          placeholder='wykorzystanaIlosc'
          onChange={(e) => onChange(e, setUsedDays)}
          min={0}
          max={maxCountOfDays}
        />
      </FloatingLabel>
      <FloatingLabel
        controlId='countFromPast'
        label='Zaległe dni urlopu'
        className='m-1 w-auto flex-grow-1'>
        <Form.Control
          value={pastDays}
          type='number'
          placeholder='zaleglaIlosc'
          onChange={(e) => onChange(e, setPastDays)}
          min={0}
          max={26}
        />
      </FloatingLabel>
      <FloatingLabel
        controlId='maxCountOfDays'
        label='Ilość dni urlopu w ciągu roku'
        className='m-1 w-100 flex-grow-1'>
        <Form.Control
          value={maxCountOfDays}
          type='number'
          placeholder='maxIlosc'
          onChange={(e) => onChange(e, setMaxCountOfDays)}
          min={0}
          max={26}
        />
      </FloatingLabel>
    </div>
  );
};

export default NewVacation;
