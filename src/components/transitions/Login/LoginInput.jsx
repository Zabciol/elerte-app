import React, { useState, useEffect, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import arrow from "../../../assets/arrow2.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const LoginInput = (props) => {
  const mailRef = useRef("");
  const passwordRef = useRef("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showToggle, setShowToggle] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);

  const changeMail = (e) => {
    if (mailRef.current.value !== "") setShowToggle(true);
    else setShowToggle(false);
  };

  const changePassword = (e) => {
    if (mailRef.current.value !== "" && passwordRef.current.value !== "") {
      setShowToggle(false);
    } else {
      setShowToggle(true);
    }
  };

  const submit = () => {
    props.submit(mail, passwordRef.current.value);
  };
  const toggleAccordion = () => {
    setOpenAccordion(!openAccordion);
  };

  useEffect(() => {
    mailRef.current.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && mailRef.current.value !== "") {
        setOpenAccordion(true);
        e.preventDefault();
        passwordRef.current.focus();
      }
    });
    passwordRef.current.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && passwordRef.current.value !== "") {
        e.preventDefault();
        props.submit(mailRef.current.value, passwordRef.current.value);
      }
    });

    return () => {
      if (mailRef.current) {
        mailRef.current.removeEventListener("keypress", this);
      }
    };
  }, []);

  return (
    <Accordion activeKey={openAccordion ? "0" : null} data-bs-theme='light'>
      <FloatingLabel
        controlId='floatingInput'
        label='Adres email'
        data-bs-theme='light'
        className='mb-3'>
        <Form.Control
          ref={mailRef}
          type='email'
          placeholder='name@example.com'
          onChange={changeMail}
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
        <FloatingLabel controlId='floatingPassword' label='Hasło'>
          <Form.Control
            ref={passwordRef}
            type='password'
            placeholder='Hasło'
            onChange={changePassword}
          />
          {mailRef.current.value && passwordRef.current.value ? (
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
