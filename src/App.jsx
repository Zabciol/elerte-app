import React, { useState, useEffect } from "react";
import LoginPanel from "./components/transitions/Login/LoginPanel";
import PageHandler from "./components/layout/PageHandler";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem("userTokenElerteApp"));

  const logout = () => {
    setIsLogged(false);
  };
  useEffect(() => {
    if (token) {
      setIsLogged(true);
      setUser(token);
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
