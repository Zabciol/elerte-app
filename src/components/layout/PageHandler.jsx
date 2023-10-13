import React, { useState, useEffect } from "react";
import "../../styles/Home/home.css";
import Menu from "./Menu";
import Personal from "../transitions/Personal";
import ECP from "../transitions/ECP.jsx";
import Employees from "../transitions/Employees";
import Calender from "../transitions/Calender";
import Conclusions from "../transitions/Conclusions";

const PageHandler = (props) => {
  const [page, setPage] = useState("Home");

  const componentMap = {
    Home: <Personal user={props.user} page={page} />,
    ECP: <ECP user={props.user} page={page} />,
    Pracownicy: <Employees user={props.user} page={page} />,
    Wnioski: <Conclusions user={props.user} page={page} />,
    Kalendarz: <Calender user={props.user} page={page} />,
  };
  return (
    <div className='homeCard'>
      <Menu logout={props.logout} setPage={setPage} />
      <div className='interface'>{componentMap[page] || null}</div>
    </div>
  );
};

export default PageHandler;
