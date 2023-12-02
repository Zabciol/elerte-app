import React, { useState, useEffect, useRef } from "react";
import ConfirmPupUp from "../common/ConfirmPopUp";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { changePasswordApi } from "../../api/authApi";
import { useAuth } from "./Login/AuthContext";
import PasswordInput from "../common/PasswordInput";

const ChangePassword = ({ user, show, setShow, title = "Zmiana hasła" }) => {
  const { setShowPopUp, setShowPopUpLogout, setMessage } = useAuth();
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const newPasswordRepeatRef = useRef("");

  const decline = () => {
    setShow(false);
  };

  const confirm = async () => {
    try {
      const response = await changePasswordApi(
        oldPasswordRef.current.value,
        newPasswordRef.current.value,
        newPasswordRepeatRef.current.value,
        user.ID
      );
      console.log(response.message);
      setMessage(response.message);
      setShowPopUp(true);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
      setShow(false);
    }
  };
  const handleOldPasswordKeyDown = (e) => {
    if (e.key === "Enter" && oldPasswordRef.current.value !== "") {
      e.preventDefault();
      newPasswordRef.current.focus();
    }
  };

  const handleNewPasswordKeyDown = (e) => {
    if (e.key === "Enter" && newPasswordRef.current.value !== "") {
      e.preventDefault();
      newPasswordRepeatRef.current.focus();
    }
  };

  const handleNewPasswordRepeatKeyDown = (e) => {
    if (e.key === "Enter" && newPasswordRepeatRef.current.value !== "") {
      e.preventDefault();
      confirm();
    }
  };
  useEffect(() => {
    if (show) oldPasswordRef.current.focus();
  }, [show]);

  return (
    <ConfirmPupUp
      show={show}
      hide={() => setShow(false)}
      title={title}
      confirm={confirm}
      confirmText={"Zmień hasło"}
      decline={decline}
      declineText={"Anuluj"}>
      <Form>
        <FloatingLabel controlId='floatingOldPassword' label='Stare hasło'>
          <PasswordInput
            inputRef={oldPasswordRef}
            type='password'
            placeholder='Password'
            onKeyDown={handleOldPasswordKeyDown}
          />
        </FloatingLabel>
        <FloatingLabel controlId='floatingNewPassword' label='Nowe hasło'>
          <PasswordInput
            inputRef={newPasswordRef}
            type='password'
            placeholder='Password'
            onKeyDown={handleNewPasswordKeyDown}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId='floatingNewPasswordRepeat'
          label='Powtórz nowe hasło'>
          <PasswordInput
            inputRef={newPasswordRepeatRef}
            type='password'
            placeholder='Password'
            onKeyDown={handleNewPasswordRepeatKeyDown}
          />
        </FloatingLabel>
      </Form>
    </ConfirmPupUp>
  );
};

export default ChangePassword;
