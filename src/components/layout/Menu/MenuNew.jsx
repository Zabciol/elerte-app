import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../../assets/logo.png";
import MenuItems from "./MenuItems";
import MenuHeader from "./MenuHeader";
import "../../../styles/Home/menu.css";

const MenuNew = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
          <MenuHeader logout={props.logout} user={props.user}></MenuHeader>
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
