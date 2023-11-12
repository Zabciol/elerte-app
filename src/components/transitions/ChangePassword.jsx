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

  return (
    <ConfirmPupUp
      show={show}
      title={"Zmiana hasła"}
      confirmText={"Zmień hasło"}
      decline={decline}
      declineText={"Anuluj"}>
      <>
        <FloatingLabel controlId='floatingOldPassword' label='Stare hasło'>
          <Form.Control type='password' placeholder='Password' />
        </FloatingLabel>
        <FloatingLabel controlId='floatingNewPassword' label='Nowe hasło'>
          <Form.Control type='password' placeholder='Password' />
        </FloatingLabel>
        <FloatingLabel
          controlId='floatingNewPasswordRepeat'
          label='Powtórz nowe hasło'>
          <Form.Control type='password' placeholder='Password' />
        </FloatingLabel>
      </>
    </ConfirmPupUp>
  );
};

export default ChangePassword;
