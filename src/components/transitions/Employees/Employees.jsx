import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/NavDropdown";
import { SelectDzial } from "../../layout/Menu/MenuForms";

const MenuItems = ({ dzial, dzialy, setDzial }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
    </>
  );
};

const Employees = ({ user, setMenuItems, subordinates }) => {
  const dzialy = Array.from(new Set(subordinates.map((item) => item.Dzial)));
  const [dzial, setDzial] = useState(dzialy[0]);
  useEffect(() => {
    setMenuItems(
      <MenuItems dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
    );
  }, []);
  return <div>Employees</div>;
};

export default Employees;
