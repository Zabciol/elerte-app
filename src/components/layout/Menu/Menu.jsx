import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../../assets/logo.png";
import MenuItems from "./MenuItems";
import MenuHeader from "./MenuHeader";
import { setDarkThemeForApp } from "../../common/CommonFunctions";
import "../../../styles/Home/menu.css";

const Menu = (props) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("DarkTheme"))
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSwitchTheme = (event) => {
    event.stopPropagation();
    const dark = !darkMode;
    setDarkMode(dark);
    setDarkThemeForApp(dark);
  };
  return (
    <Navbar expand='xl' className='bg-body-tertiary mb-3 menu '>
      <Container fluid>
        <Navbar.Brand href='#'>
          <img src={logo} className='logo'></img>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-lg`}
          onClick={handleShow}
        />
        <Navbar.Offcanvas
          show={show}
          onHide={handleClose}
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement='end'
          className='background text-white'>
          <MenuHeader
            logout={props.logout}
            user={props.user}
            darkMode={darkMode}
            handleSwitchTheme={handleSwitchTheme}
          />
          <MenuItems
            logout={props.logout}
            setPage={props.setPage}
            show={show}
            user={props.user}
            menuItems={props.menuItems}
            darkMode={darkMode}
            handleSwitchTheme={handleSwitchTheme}
          />
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Menu;
