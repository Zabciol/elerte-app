import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import logo from "../../../assets/logo.png";
import "../../../styles/Home/menu.css";

const Menu = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const nav_items = ["Home", "ECP", "Pracownicy", "Kalendarz", "Wnioski"];

  const onClickMenuItem = (item) => {
    console.log(item);
    props.setPage(item);
  };

  return (
    <>
      <div className='background-logo'></div>
      <nav className='menu'>
        <img src={logo} className='logo'></img>
        <>
          <div className='menuToggle' onClick={handleShow}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement='end'
            data-bs-theme='dark'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <NavDropdown
                  title={props.user.Imie + " " + props.user.Nazwisko}
                  id='basic-nav-dropdown'>
                  <NavDropdown.Item>Zmień hasło</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      props.logout();
                    }}>
                    Wyloguj
                  </NavDropdown.Item>
                </NavDropdown>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-center'>
                {nav_items.map((item) => (
                  <Nav.Link
                    onClick={() => {
                      onClickMenuItem(item);
                    }}>
                    {item}
                  </Nav.Link>
                ))}
                {props.menuItems}
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </>
      </nav>
    </>
  );
};

export default Menu;
