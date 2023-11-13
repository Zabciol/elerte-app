import React, { useState } from "react";
import { Children } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useAuth } from "../../transitions/Login/AuthContext";
import ChangePassword from "../../transitions/ChangePassword";
const MenuItems = (props) => {
  const { user, darkMode, handleSwitchTheme, children, show } = props;
  const { logout } = useAuth();
  const nav_items = ["ECP", "Pracownicy", "Kalendarz", "Wnioski"];
  const [showChangePassword, setShowChangePassword] = useState(false);

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
            <NavDropdown.Item
              onClick={() => {
                setShowChangePassword(true);
              }}>
              Zmień hasło
            </NavDropdown.Item>
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
      <ChangePassword
        user={user}
        show={showChangePassword}
        setShow={setShowChangePassword}
      />
    </Offcanvas.Body>
  );
};

export default MenuItems;
