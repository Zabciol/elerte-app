import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import arrow from "../../../assets/arrow2.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const LoginInput = (props) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showToggle, setShowToggle] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);

  const changeMail = (e) => {
    setMail(e.target.value);
    if (password === "") setShowToggle(true);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
    setShowToggle(false);
  };

  const submit = () => {
    props.submit(mail, password);
  };
  const toggleAccordion = () => {
    setOpenAccordion(!openAccordion);
  };

  useEffect(() => {
    if (password === "") {
      setOpenAccordion(false);
      setShowToggle(true);
    }
  }, [password]);

  return (
    <Accordion activeKey={openAccordion ? "0" : null} data-bs-theme='light'>
      <FloatingLabel
        controlId='floatingInput'
        label='Adres email'
        data-bs-theme='light'
        className='mb-3'>
        <Form.Control
          type='email'
          placeholder='name@example.com'
          onChange={changeMail}
          value={mail}
        />
        {showToggle ? (
          <img
            src={arrow}
            alt='arrow'
            className='arrow'
            onClick={toggleAccordion}></img>
        ) : null}
      </FloatingLabel>

      <Accordion.Collapse eventKey='0'>
        <FloatingLabel controlId='floatingPassword' label='Password'>
          <Form.Control
            type='password'
            placeholder='Password'
            onChange={changePassword}
            value={password}
          />
          {mail && password ? (
            <img
              src={arrow}
              alt='arrow'
              className='arrow'
              onClick={submit}></img>
          ) : null}
        </FloatingLabel>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default LoginInput;
