import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
const Home = (props) => {
  const menuItems = <></>;

  useEffect(() => {
    props.setMenuItems(menuItems);
  }, []);
  return (
    <div>
      <h3>Witaj {props.user.Imie}</h3>
    </div>
  );
};

export default Home;
