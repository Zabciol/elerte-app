import React, { useState, useEffect } from "react";
import "../../../styles/Login/login.css";
import logo from "../../../assets/logo.png";
import LoginInput from "./LoginInput";
import { loginApi } from "../../../api/authApi.js";

const LoginPanel = () => {
  const submit = async (email, password) => {
    console.log(email);
    console.log(password);
    try {
      const data = await loginApi(email, password);
      localStorage.setItem("userToken", data.token);
      // Tutaj możesz np. przekierować użytkownika do innego widoku lub odświeżyć komponenty
    } catch (error) {
      console.log(error.message || "Login failed. Please try again.");
    }
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
