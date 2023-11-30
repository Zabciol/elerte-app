import React from "react";

const RenderChildren = (props) => {
  const hasContent = React.Children.toArray(props.children).some((child) => {
    // Jeśli dziecko jest tekstem, JSX lub generuje treść, uważamy, że zawiera treść
    return (
      typeof child === "string" ||
      React.isValidElement(child) ||
      (child && child.props && child.props.children)
    );
  });

  if (hasContent) {
    return <>{props.children}</>;
  } else {
    return <h3>Brak zawartości.</h3>;
  }
};

export default RenderChildren;
