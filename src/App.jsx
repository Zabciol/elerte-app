import React, { useState, useEffect } from "react";
import LoginPanel from "./components/transitions/Login/LoginPanel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem("userToken"));

  useEffect(() => {
    if (token) {
      setIsLogged(true);
      setUser(token);
    }
  }, []);

  console.log(user);
  return <div className='App'>{isLoggedIn ? <LoginPanel /> : <div></div>}</div>;
}

export default App;