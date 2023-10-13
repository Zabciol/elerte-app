import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import logout from "../../assets/logout-btn.png";
import "../../styles/Home/menu.css";

const Menu = (props) => {
  const [toggle, setToggle] = useState(false);
  const nav_items = ["Home", "ECP", "Pracownicy", "Kalendarz", "Wnioski"];

  const onClickMenuItem = (item) => {
    console.log(item);
    props.setPage(item);
  };

  const togleNav = () => {
    setToggle(!toggle);
  };

  const filteredNav_items = nav_items.filter((item) => item !== props.page);

  return (
    <Navbar expand='lg' expanded={toggle}>
      <Container fluid>
        <Navbar.Brand href='#'>
          <img
            src={logout}
            onClick={() => {
              props.logout();
            }}
            className='logout'></img>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-lg`}
          onClick={togleNav}
        />
        <Navbar.Offcanvas
          data-bs-theme='dark'
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement='end'>
          <Offcanvas.Header
            closeButton
            className='closeBtn'
            onClick={togleNav}></Offcanvas.Header>
          <Offcanvas.Body className='white' onClick={togleNav}>
            <Nav className='justify-content-end pe-3'>
              {filteredNav_items.map((item) => (
                <Nav.Link
                  onClick={() => {
                    onClickMenuItem(item);
                  }}>
                  {item}
                </Nav.Link>
              ))}
            </Nav>
            {props.menuItems}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Menu;
