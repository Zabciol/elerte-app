import React, { useState, useEffect, useRef } from "react";
import ConfirmPupUp from "../common/ConfirmPopUp";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const ChangePassword = ({ user, show, setShow }) => {
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const newPasswordRepeatRef = useRef("");

  const decline = () => {
    setShow(false);
  };

  const confirm = () => {
    console.log("Teoretyczna zmiana hasła");
  };

  return (
    <ConfirmPupUp
      show={show}
      title={"Zmiana hasła"}
      confirm={confirm}
      confirmText={"Zmień hasło"}
      decline={decline}
      declineText={"Anuluj"}>
      <>
        <FloatingLabel controlId='floatingOldPassword' label='Stare hasło'>
          <Form.Control
            ref={oldPasswordRef}
            type='password'
            placeholder='Password'
          />
        </FloatingLabel>
        <FloatingLabel controlId='floatingNewPassword' label='Nowe hasło'>
          <Form.Control
            ref={newPasswordRef}
            type='password'
            placeholder='Password'
          />
        </FloatingLabel>
        <FloatingLabel
          ref={newPasswordRepeatRef}
          controlId='floatingNewPasswordRepeat'
          label='Powtórz nowe hasło'>
          <Form.Control type='password' placeholder='Password' />
        </FloatingLabel>
      </>
    </ConfirmPupUp>
  );
};

export default ChangePassword;
