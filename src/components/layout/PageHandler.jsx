import React, { useState, useEffect } from "react";
import "../../styles/Home/home.css";
import Home from "../transitions/Home.jsx";
import ECP from "../transitions/ECP/ECP.jsx";
import Employees from "../transitions/Employees";
import Calender from "../transitions/Calender";
import Conclusions from "../transitions/Conclusions";
import Container from "react-bootstrap/Container";
import { subordinatesApi } from "../../api/employeesApi";
import MenuNew from "./Menu/MenuNew";

const PageHandler = (props) => {
  const [page, setPage] = useState("Home");
  const [menuItems, setMenuItems] = useState();
  const [subordinates, setSubordinates] = useState();

  const getSubordinates = async () => {
    const data = await subordinatesApi(props.user.ID);
    setSubordinates(data.data);
  };

  const componentMap = {
    Home: <Home user={props.user} setMenuItems={setMenuItems}></Home>,
    ECP: (
      <ECP
        user={props.user}
        setMenuItems={setMenuItems}
        subordinates={subordinates}
      />
    ),
    Pracownicy: <Employees user={props.user} setMenuItems={setMenuItems} />,
    Wnioski: <Conclusions user={props.user} setMenuItems={setMenuItems} />,
    Kalendarz: <Calender user={props.user} setMenuItems={setMenuItems} />,
  };

  useEffect(() => {
    getSubordinates();
  }, []);

  return (
    <Container expand='lg'>
      <MenuNew
        setPage={setPage}
        page={page}
        menuItems={menuItems}
        user={props.user}
        logout={props.logout}></MenuNew>
      <div className='interface'>{componentMap[page] || null}</div>
    </Container>
  );
};

export default PageHandler;
