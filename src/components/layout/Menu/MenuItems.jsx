import React from "react";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

const MenuItems = (props) => {
  const nav_items = ["ECP", "Pracownicy", "Kalendarz", "Wnioski"];

  const onClickMenuItem = (item) => {
    console.log(item);
    props.setPage(item);
  };

  return (
    <Offcanvas.Body>
      <Nav className='justify-content-start flex-grow-1 pe-3 '>
        {!props.show ? (
          <NavDropdown
            title={props.user.Imie + " " + props.user.Nazwisko}
            id='basic-nav-dropdown'>
            <NavDropdown.Item>
              <Form onClick={(event) => event.preventDefault()}>
                <Form.Check // prettier-ignore
                  checked={props.darkMode}
                  type='switch'
                  id='custom-switch'
                  label='Ciemny motyw'
                  onClick={props.handleSwitchTheme}
                  onChange={() => {}}
                />{" "}
              </Form>
            </NavDropdown.Item>
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
      <hr className='solid' />
      <Nav>{props.menuItems}</Nav>
    </Offcanvas.Body>
  );
};

export default MenuItems;
