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
            <Nav className='justify-content-end flex-grow-1 pe-3'>
              {nav_items.map((item) => (
                <Nav.Link
                  onClick={() => {
                    onClickMenuItem(item);
                  }}>
                  {item}
                </Nav.Link>
              ))}
            </Nav>
            <Form className='d-flex'>
              <Form.Control
                type='search'
                placeholder='Search'
                className='me-2'
                aria-label='Search'
              />
              <Button variant='dark'>Search</Button>
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Menu;
