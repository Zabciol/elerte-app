import React, { useState, useEffect } from "react";
import "../../../styles/Login/login.css";
import logo from "../../../assets/logo-elerte.png";
import LoginInput from "./LoginInput";
import { loginApi } from "../../../api/authApi.js";
import { useAuth } from "./AuthContext";

const LoginPanel = (props) => {
  const { login } = useAuth();
  const [message, setMessage] = useState("");

  const submit = async (email, password) => {
    console.log(email);
    console.log(password);
    try {
      await login(email, password);
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <div className='LoginPanel' data-bs-theme='light'>
      <img src={logo} alt='logo' className='login-img' />
      <div className='LoginPanel-form'>
        <LoginInput submit={submit} />
        <p style={{ color: `black` }}>{message}</p>
      </div>
    </div>
  );
};

export default LoginPanel;
