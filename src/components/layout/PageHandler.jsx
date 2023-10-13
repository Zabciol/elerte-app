import React, { useState, useEffect } from "react";
import "../../styles/Home/home.css";
import Menu from "./Menu";
import Home from "../transitions/Home.jsx";
import ECP from "../transitions/ECP.jsx";
import Employees from "../transitions/Employees";
import Calender from "../transitions/Calender";
import Conclusions from "../transitions/Conclusions";

const PageHandler = (props) => {
  const [page, setPage] = useState("Home");
  const [menuItems, setMenuItems] = useState();

  const componentMap = {
    Home: <Home user={props.user} page={page} setMenuItems={setMenuItems} />,
    ECP: <ECP user={props.user} page={page} />,
    Pracownicy: <Employees user={props.user} page={page} />,
    Wnioski: <Conclusions user={props.user} page={page} />,
    Kalendarz: (
      <Calender user={props.user} page={page} setMenuItems={setMenuItems} />
    ),
  };
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
