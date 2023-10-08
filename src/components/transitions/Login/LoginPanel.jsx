import React, { useState, useEffect } from "react";
import "../../../styles/Login/login.css";
import logo from "../../../assets/logo.png";
import arrow from "../../../assets/arrow2.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import LoginInput from "./LoginInput";

const LoginPanel = () => {
  const submit = (mail, password) => {
    console.log(mail);
    console.log(password);
  };
  return (
    <div className='LoginPanel'>
      <img src={logo} alt='logo' />
      <div className='LoginPanel-form'>
        <LoginInput submit={submit} />
      </div>
    </div>
  );
};

export default LoginPanel;
