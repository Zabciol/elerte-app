import React, { useEffect } from "react";

const ECP = (props) => {
  const menuItems = <></>;

  useEffect(() => {
    props.setMenuItems(menuItems);
  }, []);
  return <div>ECP</div>;
};

export default ECP;
