import React, { useState, useEffect } from "react";
import "../../../styles/Login/login.css";
import logo from "../../../assets/logo.png";
import LoginInput from "./LoginInput";
import { loginApi } from "../../../api/authApi.js";

const LoginPanel = (props) => {
  const submit = async (email, password) => {
    console.log(email);
    console.log(password);
    try {
      const data = await loginApi(email, password);
      localStorage.setItem("userTokenElerteApp", JSON.stringify(data.user));
      console.log("Zalogowano");
      props.setUser(data.user);
      props.setIsLogged(true);
    } catch (error) {
      console.log(error.message || "Login failed. Please try again.");
    }
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
