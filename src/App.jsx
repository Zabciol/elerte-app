import React, { useState, useEffect, useContext, createContext } from "react";
import LoginPanel from "./components/transitions/Login/LoginPanel";
import PageHandler from "./components/layout/PageHandler";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./components/transitions/Login/AuthContext";

function App() {
  const { user, isLogged } = useAuth(); // Korzystamy z wartości z AuthContext
  const darkTheme = JSON.parse(localStorage.getItem("DarkTheme"));

  useEffect(() => {
    const html = document.documentElement;
    if (darkTheme) {
      html.setAttribute("data-bs-theme", "dark");
      html.setAttribute("data-theme", "dark");
    } else {
      html.setAttribute("data-bs-theme", "light");
      html.setAttribute("data-theme", "light");
    }
  }, []);

  console.log(user);
  return (
    <div className='App'>
      {isLogged ? <PageHandler user={user} /> : <LoginPanel />}
    </div>
  );
}

export default App;
