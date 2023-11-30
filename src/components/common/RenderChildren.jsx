import React from "react";

const RenderChildren = (props) => {
  const nonNullChildren = React.Children.toArray(props.children).filter(
    (child) => child !== null && child !== undefined
  );

  if (nonNullChildren.length === 0) {
    console.log("nie ma dzieci");
    return <h3>Brak danych</h3>; // Jeśli wszystkie dzieci są null, nie renderuj niczego
  }

  return <>{nonNullChildren}</>;
};

export default RenderChildren;
