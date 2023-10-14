import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
const Home = (props) => {
  const menuItems = (
    <>
      <Nav>
        <Nav.Link
          onClick={() => {
            props.logout();
          }}>
          Wyloguj
        </Nav.Link>
      </Nav>
    </>
  );

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
