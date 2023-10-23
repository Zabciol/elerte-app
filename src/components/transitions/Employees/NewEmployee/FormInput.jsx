import React from "react";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const FormInput = ({ stepData, handleChange, values, handleNext }) => {
  return (
    <div className='new-employee-form'>
      {stepData.fields.map((field) =>
        field.type === "input" ? (
          <FloatingLabel
            key={field.label}
            controlId='floatingInput'
            label={field.label}
            className='mb-3'>
            <Form.Control
              type={field.inputType || "text"}
              value={values[field.name]}
              onChange={handleChange(field.name)}
            />
          </FloatingLabel>
        ) : (
          <>
            <FloatingLabel label={field.label} key={field.label}>
              <Form.Select
                size='lg'
                aria-label='Default select example'
                className='new-employee-select'
                onChange={handleChange(field.name)}
                value={values[field.name]}>
                {field.options.map((option) => (
                  <option key={option.ID} value={option.ID}>
                    {option.Nazwa}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </>
        )
      )}
      <Button
        variant='primary'
        className='add-new-employee-btn'
        onClick={handleNext}>
        {stepData.buttonLabel}
      </Button>{" "}
    </div>
  );
};

export default FormInput;
