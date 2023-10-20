import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/NavDropdown";

export const SelectDzial = ({ dzial, dzialy, setDzial }) => {
  return (
    <NavDropdown title={dzial} id='basic-nav-dropdown'>
      {dzialy.map((item) => (
        <NavDropdown.Item key={item} onClick={() => setDzial(item)}>
          {item}
        </NavDropdown.Item>
      ))}
      <Dropdown.Divider />
      <NavDropdown.Item onClick={() => setDzial("Każdy")}>
        Każdy
      </NavDropdown.Item>
    </NavDropdown>
  );
};
