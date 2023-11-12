import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useAuth } from "../../transitions/Login/AuthContext";
import ChangePassword from "../../transitions/ChangePassword";

const MenuHeader = (props) => {
  const { logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    logout();
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
                checked={props.darkMode}
                type='switch'
                id='custom-switch'
                label='Ciemny motyw'
                onClick={props.handleSwitchTheme}
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
          <NavDropdown.Item onClick={handleLogout}>Wyloguj</NavDropdown.Item>
        </NavDropdown>
      </Offcanvas.Title>
      <ChangePassword
        user={props.user}
        show={showChangePassword}
        setShow={setShowChangePassword}
      />
    </Offcanvas.Header>
  );
};

export default MenuHeader;
