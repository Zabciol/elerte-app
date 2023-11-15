import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Carousel from "react-bootstrap/Carousel";

const Home = ({ user, setMenuItems }) => {
  const menuItems = <></>;

  useEffect(() => {
    setMenuItems(menuItems);
  }, []);
  return (
    <div>
      <h3>Witaj {user.Imie}</h3>
    </div>
  );
};

export default Home;
