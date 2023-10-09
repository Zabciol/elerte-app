import React, { useState } from "react";
import "../../styles/Home/home.css";
import Menu from "./Menu";

const Home = (props) => {
  return (
    <div className='homeCard'>
      <Menu />
      <button
        onClick={() => {
          props.setIsLogged(false);
        }}></button>
    </div>
  );
};

export default Home;
