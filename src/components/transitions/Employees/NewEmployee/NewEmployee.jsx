import React, { useState } from "react";
import NewEmployeeForm from "./NewEmployeeForm";
import NewEmployeeSubordinates from "./NewEmployeeSubordinates";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import Spinner from "react-bootstrap/Spinner";

const NewEmployee = (props) => {
  const [newEmployee, setNewEmployee] = useState({});
  const [stage, setStage] = useState(1);
  const [showPopUp, setShowPopUp] = useState(false);
  const [subordinates, setSubordinates] = useState([]);
  const decline = () => {
    setShowPopUp(false);
    addToDB();
  };
  const confirm = () => {
    setStage(2);
    setShowPopUp(false);
  };
  const addToDB = () => {
    console.log(newEmployee);
    console.log(subordinates);
    setStage(3);
  };
  return (
    <>
      {stage === 1 ? (
        <NewEmployeeForm
          setShowPopUp={setShowPopUp}
          setNewEmployee={setNewEmployee}
        />
      ) : null}
      {stage === 2 ? (
        <NewEmployeeSubordinates
          subordinates={subordinates}
          setSubordinates={setSubordinates}
          dzial={props.dzial}
          action={addToDB}
        />
      ) : null}
      {stage === 3 ? <Spinner animation='border' /> : null}
      <ConfirmPupUp
        show={showPopUp}
        decline={decline}
        confirm={confirm}
        title={"Powiadomienie"}
        message={"Czy ten pracownik ma być czyimś przełozonym?"}
        declineText={"Nie"}
        confirmText={"Tak"}
      />
    </>
  );
};

export default NewEmployee;
