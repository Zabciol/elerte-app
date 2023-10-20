import React, { useEffect } from "react";

const Employees = (props) => {
  const menuItems = <></>;

  useEffect(() => {
    props.setMenuItems(menuItems);
  }, []);
  return <div>Employees</div>;
};

export default Employees;
