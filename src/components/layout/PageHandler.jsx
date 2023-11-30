import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "../../styles/pageHandler.css";
import Home from "../transitions/Home/Home.jsx";
import ECP from "../transitions/ECP/ECP.jsx";
import Employees from "../transitions/Employees/Employees";
import Calender from "../transitions/Calender/Calender";
import Container from "react-bootstrap/Container";
import Requests from "../transitions/Requests/Requests";
import { subordinatesApi } from "../../api/employeesApi";
import { useAuth } from "../transitions/Login/AuthContext.jsx";
import Menu from "./Menu/Menu";

const PageHandler = (props) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [menuItems, setMenuItems] = useState();
  const [subordinates, setSubordinates] = useState([]);
  const [user, setUser] = useState({ ...props.user, supervisor: false });

  const getSubordinates = async () => {
    try {
      console.log(user);
      const data = await subordinatesApi(props.user.ID);
      console.log(data);
      setUser({
        ...user,
        supervisor:
          user.Uprawnienia === 5 || user.Uprawnienia === 4
            ? true
            : data.supervisor,
      });
      console.log(data);
      setSubordinates(data.data);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    getSubordinates();
  }, []);
  return (
    <Router>
      <Container expand='lg'>
        <Menu user={user} logout={props.logout}>
          {menuItems}
        </Menu>
        <div className='interface'>
          <Routes>
            <Route
              path='/'
              element={<Home user={user} setMenuItems={setMenuItems} />}
            />
            <Route
              path='/ecp'
              element={
                <ECP
                  user={user}
                  setMenuItems={setMenuItems}
                  subordinates={[user, ...subordinates]}
                />
              }
            />
            <Route
              path='/pracownicy'
              element={
                <Employees
                  user={user}
                  setMenuItems={setMenuItems}
                  subordinates={subordinates}
                />
              }
            />
            <Route
              path='/wnioski'
              element={
                <Requests
                  user={user}
                  setMenuItems={setMenuItems}
                  subordinates={subordinates}
                />
              }
            />
            <Route
              path='/kalendarz'
              element={
                <Calender
                  user={user}
                  setMenuItems={setMenuItems}
                  subordinates={[user, ...subordinates]}
                />
              }
            />
          </Routes>
        </div>
      </Container>
    </Router>
  );
};

export default PageHandler;
