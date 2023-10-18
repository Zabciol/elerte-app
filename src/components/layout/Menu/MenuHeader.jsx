import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

const MenuHeader = (props) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("DarkTheme"))
  );
  const handleSwitchClick = (event) => {
    event.stopPropagation();
    const dark = !darkMode;
    setDarkMode(dark);
    const html = document.documentElement;

    if (dark) {
      localStorage.setItem("DarkTheme", JSON.stringify(dark));
      html.setAttribute("data-bs-theme", "dark");
      html.setAttribute("data-theme", "dark");
    } else {
      localStorage.setItem("DarkTheme", JSON.stringify(dark));
      html.setAttribute("data-bs-theme", "light");
      html.setAttribute("data-theme", "light");
    }
  };
  return (
    <Offcanvas.Header closeButton>
      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
        <NavDropdown
          title={props.user.Imie + " " + props.user.Nazwisko}
          id='basic-nav-dropdown'>
          <NavDropdown.Item>
            <Form onClick={(event) => event.preventDefault()}>
              <Form.Check // prettier-ignore
                checked={darkMode}
                type='switch'
                id='custom-switch'
                label='Ciemny motyw'
                onClick={handleSwitchClick}
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
      </Offcanvas.Title>
    </Offcanvas.Header>
  );
};

export default MenuHeader;
