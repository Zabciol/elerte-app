import React from "react";
import { Children } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

const MenuItems = (props) => {
  const { user, darkMode, handleSwitchTheme, logout, children, show } = props;
  const nav_items = ["ECP", "Pracownicy", "Kalendarz", "Wnioski"];

  return (
    <Offcanvas.Body>
      <Nav className='justify-content-start flex-grow-1 pe-3 '>
        {!show ? (
          <NavDropdown
            title={user.Imie + " " + user.Nazwisko}
            id='basic-nav-dropdown'>
            <NavDropdown.Item>
              <Form onClick={(event) => event.preventDefault()}>
                <Form.Check // prettier-ignore
                  checked={darkMode}
                  type='switch'
                  id='custom-switch'
                  label='Ciemny motyw'
                  onClick={handleSwitchTheme}
                  onChange={() => {}}
                />{" "}
              </Form>
            </NavDropdown.Item>
            <NavDropdown.Item>Zmień hasło</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={() => {
                logout();
              }}>
              Wyloguj
            </NavDropdown.Item>
          </NavDropdown>
        ) : null}
        {nav_items.map((item) => (
          <Nav.Link key={item} as={Link} to={`/${item}`}>
            {item}
          </Nav.Link>
        ))}
      </Nav>
      <hr className='solid' />
      <Nav>{children}</Nav>
    </Offcanvas.Body>
  );
};

export default MenuItems;
