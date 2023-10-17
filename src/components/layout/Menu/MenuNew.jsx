import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../../assets/logo.png";
import MenuItems from "./MenuItems";

const MenuNew = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Navbar expand='xl' className='bg-body-tertiary mb-3 menu'>
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
          data-bs-theme='dark'
          className='background'>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
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
          <MenuItems
            setPage={props.setPage}
            show={show}
            user={props.user}
            menuItems={props.menuItems}
          />
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default MenuNew;
