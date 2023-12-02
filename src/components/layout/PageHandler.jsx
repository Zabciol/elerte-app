import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "../../styles/pageHandler.css";
import Home from "../transitions/Home/Home.jsx";
import ECP from "../transitions/ECP/ECP.jsx";
import Employees from "../transitions/Employees/Employees";
import Calender from "../transitions/Calender/Calender";
import Container from "react-bootstrap/Container";
import Requests from "../transitions/Requests/Requests";
import { allEmployeesAPI } from "../../api/employeesApi";
import { subordinatesApi } from "../../api/employeesApi";
import { useAuth } from "../transitions/Login/AuthContext.jsx";
import LoadingPage from "../common/LoadingPage.jsx";
import Menu from "./Menu/Menu";
import {
  hasView,
  isAdmin,
  canFillECP,
  canEdit,
} from "../common/CommonFunctions.js";

const PageHandler = (props) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [menuItems, setMenuItems] = useState();
  const [subordinates, setSubordinates] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [user, setUser] = useState({
    ...props.user,
    supervisor: false,
    admin: false,
  });

  const getSubordinates = async () => {
    try {
      const data = await subordinatesApi(props.user.ID);
      setUser({
        ...user,
        supervisor: canFillECP(user) ? true : data.supervisor,
      });
      setSubordinates(data.data);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getAllEmployes = async () => {
    try {
      let data;
      if (hasView(user) || isAdmin(user) || canEdit(user)) {
        data = await allEmployeesAPI();
      } else {
        data = subordinates;
      }
      setAllEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    getSubordinates();
  }, []);

  useEffect(() => {
    getAllEmployes();
  }, [user, subordinates]);
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
                subordinates.length > 0 || canFillECP(user) ? (
                  <ECP
                    user={user}
                    setMenuItems={setMenuItems}
                    subordinates={[user, ...subordinates]}
                  />
                ) : (
                  <LoadingPage />
                )
              }
            />
            <Route
              path='/pracownicy'
              element={
                allEmployees.length > 0 ? (
                  <Employees
                    user={user}
                    setMenuItems={setMenuItems}
                    subordinates={allEmployees}
                  />
                ) : (
                  <LoadingPage />
                )
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
                  subordinates={[user, ...allEmployees]}
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
