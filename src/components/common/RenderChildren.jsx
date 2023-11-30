import React from "react";

const RenderChildren = (props) => {
  console.log("sprawdzam czy ma dzieci");
  const hasNonNullChildren = React.Children.toArray(props.children).some(
    (child) => {
      return child !== null && child !== undefined;
    }
  );
  hasNonNullChildren ? console.log("Ma dzieci") : console.log("Nie ma dzieci");

  if (hasNonNullChildren) {
    return <>{props.children}</>;
  } else {
    return <h3>Brak zawartości.</h3>;
  }
};

export default RenderChildren;
