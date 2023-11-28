import React, { useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const Leaves = ({ employee, urlopMax, urlopWykorzystane, urlopZalegly }) => {
  useEffect(() => {
    if (urlopMax.current) {
      urlopMax.current.value = Number(employee.urlopMaxIloscDni) || 0;
    }

    if (urlopWykorzystane.current) {
      urlopWykorzystane.current.value = Number(employee.urlopWykorzystane) || 0;
    }
    if (urlopZalegly.current) {
      urlopZalegly.current.value = Number(employee.urlopZalegly) || 0;
    }
  }, [employee]);

  return (
    <div className='d-flex flex-wrap'>
      <div className='d-flex w-50 p-1'>
        <FloatingLabel
          controlId='floatingSelect-MaxIloscDni'
          label='Maksymalna ilość dni urlopu'
          className='w-100'>
          <Form.Control
            type='number'
            min={0}
            max={26}
            placeholder='Max ilość dni'
            ref={urlopMax}
          />
        </FloatingLabel>
      </div>
      <div className='d-flex w-50 p-1'>
        <FloatingLabel
          controlId='floatingSelect-Wykorzystane'
          label='Wykorzystane dni urlopu'
          className='w-100'>
          <Form.Control
            type='number'
            min={0}
            max={26}
            placeholder='Wykorzystane dni'
            ref={urlopWykorzystane}
          />
        </FloatingLabel>
      </div>
      <div className='d-flex w-50 p-1'>
        <FloatingLabel
          controlId='floatingSelect-Zalegly'
          label='Zaległy urlop'
          className='w-100'>
          <Form.Control
            type='number'
            min={0}
            max={26}
            placeholder='Zaległy urlop'
            ref={urlopZalegly}
          />
        </FloatingLabel>
      </div>
    </div>
  );
};

export default Leaves;
