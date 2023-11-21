import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import NewDepartment from "./NewDepartment";
import NewEmployee from "./NewEmployee";
import NewPosition from "./NewPosition";
const NewMain = () => {
  const [show, setShow] = useState(false);
  const [componentType, setComponentType] = useState(null);

  const showPopUp = (type) => {
    setComponentType(type);
    setShow(true);
  };

  const cancel = () => setShow(false);

  let component;
  switch (componentType) {
    case "Nowe stanowisko":
      component = <NewPosition show={show} cancel={cancel} />;
      break;
    case "Nowy dział":
      component = <NewDepartment show={show} cancel={cancel} />;
      break;
    case "Nowy pracownik":
      component = <NewEmployee show={show} cancel={cancel} />;
      break;
    default:
      component = null;
  }

  return (
    <>
      <div className='d-flex justify-content-around m-2 flex-wrap new-home'>
        <Button
          variant='primary'
          className='m-2'
          onClick={() => showPopUp("Nowe stanowisko")}>
          Dodaj Stanowisko
        </Button>
        <Button
          variant='primary'
          className='m-2'
          onClick={() => showPopUp("Nowy dział")}>
          Dodaj Dział
        </Button>
        <Button
          variant='primary'
          className='m-2'
          onClick={() => showPopUp("Nowy pracownik")}>
          Dodaj Pracownika
        </Button>
      </div>

      {show && component}
    </>
  );
};

export default NewMain;
