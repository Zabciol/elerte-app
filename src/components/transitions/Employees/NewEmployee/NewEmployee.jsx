import React, { useState } from "react";
import NewEmployeeForm from "./NewEmployeeForm";
import NewEmployeeSupervisor from "./NewEmployeeSupervisor";
import ConfirmPupUp from "../../../common/ConfirmPopUp";

const NewEmployee = () => {
  const [newEmployee, setNewEmployee] = useState({});
  const [stage, setStage] = useState(1);
  const [showPopUp, setShowPopUp] = useState(false);

  const decline = () => {
    console.log("Odrzucono popup");
    addToDB();
    setShowPopUp(false);
  };
  const confirm = () => {
    setStage(2);
    setShowPopUp(false);
  };
  const addToDB = () => {};
  return (
    <>
      {stage === 1 ? (
        <NewEmployeeForm
          setShowPopUp={setShowPopUp}
          setNewEmployee={setNewEmployee}
        />
      ) : null}
      {stage === 2 ? (
        <NewEmployeeSupervisor
          setNewEmployee={setNewEmployee}
          newEmployee={newEmployee}
        />
      ) : null}
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
