import React, { useState, useEffect, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import arrow from "../../../assets/arrow2.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import PasswordInput from "../../common/PasswordInput";

const LoginInput = (props) => {
  const loginRef = useRef("");
  const passwordRef = useRef("");
  const [showToggle, setShowToggle] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);

  const changeMail = (e) => {
    if (loginRef.current.value !== "") setShowToggle(true);
    else setShowToggle(false);
  };

  const changePassword = (e) => {
    if (loginRef.current.value !== "" && passwordRef.current.value !== "") {
      setShowToggle(false);
    } else {
      setShowToggle(true);
    }
  };

  const submit = () => {
    props.submit(loginRef.current.value, passwordRef.current.value);
  };
  const toggleAccordion = () => {
    setOpenAccordion(!openAccordion);
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter" && passwordRef.current.value !== "") {
      e.preventDefault();
      submit();
    }
  };

  useEffect(() => {
    loginRef.current.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && loginRef.current.value !== "") {
        setOpenAccordion(true);
        e.preventDefault();
        passwordRef.current.focus();
      }
    });

    return () => {
      if (loginRef.current) {
        loginRef.current.removeEventListener("keypress", this);
      }
    };
  }, []);

  return (
    <Accordion activeKey={openAccordion ? "0" : null} data-bs-theme='light'>
      <FloatingLabel
        controlId='floatingInput'
        label='Login'
        data-bs-theme='light'
        className='mb-3'>
        <Form.Control
          ref={loginRef}
          type='text'
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
          <PasswordInput
            inputRef={passwordRef}
            type='password'
            placeholder='Hasło'
            onChange={changePassword}
            onKeyDown={handlePasswordKeyDown}
          />

          {loginRef.current.value && passwordRef.current.value ? (
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
