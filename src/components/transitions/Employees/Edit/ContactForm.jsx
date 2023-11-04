import React, { useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const ContactForm = ({ employee, mailRef, phoneNumberRef }) => {
  return (
    <Form>
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
