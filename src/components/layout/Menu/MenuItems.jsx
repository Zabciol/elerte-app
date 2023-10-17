import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

const MenuItems = (props) => {
  const nav_items = ["ECP", "Pracownicy", "Kalendarz", "Wnioski"];

  const onClickMenuItem = (item) => {
    console.log(item);
    props.setPage(item);
  };
  console.log(props.MenuItems);
  return (
    <Offcanvas.Body>
      <Nav className='justify-content-start flex-grow-1 pe-3'>
        {!props.show ? (
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
        ) : null}
        {nav_items.map((item) => (
          <Nav.Link onClick={() => onClickMenuItem(item)}>{item}</Nav.Link>
        ))}
      </Nav>
      <Nav>{props.menuItems}</Nav>
    </Offcanvas.Body>
  );
};

export default MenuItems;
