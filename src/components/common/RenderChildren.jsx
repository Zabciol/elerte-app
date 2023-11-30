import React from "react";

const RenderChildren = (props) => {
  console.log("sprawdzam czy ma dzieci");
  const hasContent = React.Children.toArray(props.children).some((child) => {
    // Jeśli dziecko jest tekstem, JSX lub generuje treść, uważamy, że zawiera treść
    return (
      typeof child === "string" ||
      React.isValidElement(child) ||
      (child && child.props && child.props.children)
    );
  });
  hasContent ? console.log("Ma dzieci") : console.log("Nie ma dzieci");

  if (hasContent) {
    return <>{props.children}</>;
  } else {
    return <h3>Brak zawartości.</h3>;
  }
};

export default RenderChildren;
