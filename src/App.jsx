import React, { useState, useEffect } from "react";
import LoginPanel from "./components/transitions/Login/LoginPanel";
import Home from "./components/layout/Home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const token = localStorage.getItem("userToken");

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
        <Home setIsLogged={setIsLogged} />
      ) : (
        <LoginPanel setIsLogged={setIsLogged} />
      )}
    </div>
  );
}

export default App;
