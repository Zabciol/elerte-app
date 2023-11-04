import React, { useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const ContactForm = ({
  employee,
  nameRef,
  lastNameRef,
  mailRef,
  phoneNumberRef,
}) => {
  return (
    <Form>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='name'>Imię</InputGroup.Text>
        <Form.Control
          aria-label='name'
          aria-describedby='name'
          ref={nameRef}
          placeholder={employee.Imie}
        />
      </InputGroup>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='name'>Nazwisko</InputGroup.Text>
        <Form.Control
          aria-label='lastname'
          aria-describedby='lastname'
          ref={lastNameRef}
          placeholder={employee.Nazwisko}
        />
      </InputGroup>
      <InputGroup className='mb-3'>
        <Form.Control
          ref={mailRef}
          placeholder={employee.Mail.replace("@elerte.pl", "")}
          aria-label={employee.Mail.replace("@elerte.pl", "")}
          aria-describedby='basic-addon2'
        />
        <InputGroup.Text id='basic-addon2'>@elerte.pl</InputGroup.Text>
      </InputGroup>
      <InputGroup className='mb-3'>
        <Form.Control
          ref={phoneNumberRef}
          placeholder={employee.NrTelefonu}
          aria-label={employee.NrTelefonu}
          aria-describedby='basic-addon2'
        />
        <InputGroup.Text id='basic-addon2'>Numer telefonu</InputGroup.Text>
      </InputGroup>
    </Form>
  );
};

export default ContactForm;
