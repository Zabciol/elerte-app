import React, { useEffect } from "react";

const Home = (props) => {
  const menuItems = <></>;

  useEffect(() => {
    props.setMenuItems(menuItems);
  });
  return <div>Home</div>;
};

export default Home;
