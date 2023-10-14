import React, { useState, useEffect } from "react";
import "../../styles/Home/home.css";
import Menu from "./Menu";
import Home from "../transitions/Home.jsx";
import ECP from "../transitions/ECP.jsx";
import Employees from "../transitions/Employees";
import Calender from "../transitions/Calender";
import Conclusions from "../transitions/Conclusions";
import { subordinatesApi } from "../../api/employeesApi";

const PageHandler = (props) => {
  const [page, setPage] = useState("Home");
  const [menuItems, setMenuItems] = useState();
  const [subordinates, setSubordinatesApi] = useState();

  const getSubordinates = async () => {
    const data = await subordinatesApi(props.user.ID);
    console.log(props.user.ID);
    console.log(data);
  };

  const componentMap = {
    Home: <Home user={props.user} setMenuItems={setMenuItems} />,
    ECP: <ECP user={props.user} setMenuItems={setMenuItems} />,
    Pracownicy: <Employees user={props.user} setMenuItems={setMenuItems} />,
    Wnioski: <Conclusions user={props.user} setMenuItems={setMenuItems} />,
    Kalendarz: <Calender user={props.user} setMenuItems={setMenuItems} />,
  };

  useEffect(() => {
    getSubordinates();
  }, []);

  return (
    <div className='homeCard'>
      <Menu
        logout={props.logout}
        setPage={setPage}
        page={page}
        menuItems={menuItems}
      />
      <div className='interface'>{componentMap[page] || null}</div>
    </div>
  );
};

export default PageHandler;
