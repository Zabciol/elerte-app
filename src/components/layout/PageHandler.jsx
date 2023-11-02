import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../../styles/Home/home.css";
import Home from "../transitions/Home.jsx";
import ECP from "../transitions/ECP/ECP.jsx";
import Employees from "../transitions/Employees/Employees";
import Calender from "../transitions/Calender/Calender";
import Container from "react-bootstrap/Container";
import Requests from "../transitions/Requests/Requests";
import { subordinatesApi } from "../../api/employeesApi";
import Menu from "./Menu/Menu";

const PageHandler = (props) => {
  const [menuItems, setMenuItems] = useState();
  const [subordinates, setSubordinates] = useState([]);

  const getSubordinates = async () => {
    const data = await subordinatesApi(props.user.ID);
    setSubordinates(data.data);
  };

  useEffect(() => {
    getSubordinates();
  }, []);

  return (
    <BrowserRouter>
      <Container expand='lg'>
        <Menu user={props.user} logout={props.logout}>
          {menuItems}
        </Menu>
        <div className='interface'>
          <Routes>
            <Route
              path='/'
              element={<Home user={props.user} setMenuItems={setMenuItems} />}
            />
            <Route
              path='/ecp'
              element={
                <ECP
                  user={props.user}
                  setMenuItems={setMenuItems}
                  subordinates={subordinates}
                />
              }
            />
            <Route
              path='/pracownicy'
              element={
                <Employees
                  user={props.user}
                  setMenuItems={setMenuItems}
                  subordinates={subordinates}
                />
              }
            />
            <Route
              path='/wnioski'
              element={
                <Requests
                  user={props.user}
                  setMenuItems={setMenuItems}
                  subordinates={subordinates}
                />
              }
            />
            <Route
              path='/kalendarz'
              element={
                <Calender
                  user={props.user}
                  setMenuItems={setMenuItems}
                  subordinates={subordinates}
                />
              }
            />
          </Routes>
        </div>
      </Container>
    </BrowserRouter>
  );
};

export default PageHandler;
