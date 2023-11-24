import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/NavDropdown";

export const SelectItems = ({
  item,
  items,
  setItem,
  displayField = "nazwa",
}) => {
  const renderItem = (item) => {
    if (typeof item === "object" && item !== null) {
      return item.Nazwa;
    }
    return item;
  };

  return (
    <NavDropdown title={renderItem(item)} id='basic-nav-dropdown'>
      {items.map((item, index) => (
        <NavDropdown.Item
          key={index}
          onClick={() => {
            setItem(item);
          }}>
          {renderItem(item)}
        </NavDropdown.Item>
      ))}
      <Dropdown.Divider />
      <NavDropdown.Item
        onClick={() =>
          typeof item === "object"
            ? setItem({ Nazwa: "Każdy" })
            : setItem("Każdy")
        }>
        Każdy
      </NavDropdown.Item>
    </NavDropdown>
  );
};
