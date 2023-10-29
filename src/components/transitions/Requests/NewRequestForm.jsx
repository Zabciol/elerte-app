import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { reasonsApi } from "../../../api/reasonsApi";
import Button from "react-bootstrap/Button";

const NewRequestForm = ({ user, mySupervisor, reason, reasons, setReason }) => {
  const textareaRef = useRef(null);
  return (
    <div className='request'>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>Od:</InputGroup.Text>
        <Form.Control
          value={user.Mail}
          aria-label='Username'
          aria-describedby='basic-addon1'
          readOnly={true}
        />
      </InputGroup>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>Do:</InputGroup.Text>
        <Form.Control
          aria-label='Text input with dropdown button'
          value={mySupervisor.Mail}
          readOnly={true}
        />
      </InputGroup>
      <Form>
        <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Wiadomość</Form.Label>
          <Form.Control as='textarea' rows={3} ref={textareaRef} />
        </Form.Group>
      </Form>
      <div className='request-bottom-form'>
        <Form.Select
          aria-label='Default select example'
          onChange={setReason}
          className='request-select'>
          {reasons.map((item, index) => (
            <option value={index} key={index}>
              {item.Nazwa}
            </option>
          ))}
        </Form.Select>
        <Button variant='primary'>Primary</Button>{" "}
      </div>
    </div>
  );
};

export default NewRequestForm;
