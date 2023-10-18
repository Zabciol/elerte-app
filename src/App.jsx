import React, { useState, useEffect } from "react";
import LoginPanel from "./components/transitions/Login/LoginPanel";
import PageHandler from "./components/layout/PageHandler";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem("userTokenElerteApp"));
  const darkTheme = JSON.parse(localStorage.getItem("DarkTheme"));

  const logout = () => {
    setIsLogged(false);
    localStorage.removeItem("userTokenElerteApp");
  };
  useEffect(() => {
    if (token) {
      setIsLogged(true);
      setUser(token);
    }
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
      {isLoggedIn ? (
        <PageHandler logout={logout} user={user} />
      ) : (
        <LoginPanel setIsLogged={setIsLogged} setUser={setUser} />
      )}
    </div>
  );
}

export default App;
