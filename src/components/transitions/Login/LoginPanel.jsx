import React, { useState, useEffect } from "react";
import "../../../styles/Login/login.css";
import logo from "../../../assets/logo-elerte.png";
import LoginInput from "./LoginInput";
import { loginApi } from "../../../api/authApi.js";
import { useAuth } from "./AuthContext";

const LoginPanel = (props) => {
  const { login } = useAuth();

  const submit = async (email, password) => {
    console.log(email);
    console.log(password);
    await login(email, password);
  };
  return (
    <div className='LoginPanel' data-bs-theme='light'>
      <img src={logo} alt='logo' />
      <div className='LoginPanel-form'>
        <LoginInput submit={submit} />
      </div>
    </div>
  );
};

export default LoginPanel;
