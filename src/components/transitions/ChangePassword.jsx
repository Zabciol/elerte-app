import React, { useState, useEffect, useRef } from "react";
import ConfirmPupUp from "../common/ConfirmPopUp";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { changePasswordApi } from "../../api/authApi";
import { useAuth } from "./Login/AuthContext";

const ChangePassword = ({ user, show, setShow }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const newPasswordRepeatRef = useRef("");

  const decline = () => {
    setShow(false);
  };

  const confirm = async () => {
    try {
      await changePasswordApi(
        oldPasswordRef.current.value,
        newPasswordRef.current.value,
        newPasswordRepeatRef.current.value,
        user.ID
      );
      setShow(false);
    } catch (error) {
      setShow(false);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  return (
    <ConfirmPupUp
      show={show}
      hide={() => setShow(false)}
      title={"Zmiana hasła"}
      confirm={confirm}
      confirmText={"Zmień hasło"}
      decline={decline}
      declineText={"Anuluj"}>
      <Form>
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
          controlId='floatingNewPasswordRepeat'
          label='Powtórz nowe hasło'>
          <Form.Control
            ref={newPasswordRepeatRef}
            type='password'
            placeholder='Password'
          />
        </FloatingLabel>
      </Form>
    </ConfirmPupUp>
  );
};

export default ChangePassword;
