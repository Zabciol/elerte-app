import React, { useState } from "react";
import NewEmployeeForm from "./NewEmployeeForm";
import NewEmployeeSubordinates from "./NewEmployeeSubordinates";
import PopUp from "../../../common/PopUp";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import Spinner from "react-bootstrap/Spinner";
import { addEmployee } from "../../../../api/employeesApi";

const NewEmployee = (props) => {
  const [newEmployee, setNewEmployee] = useState({});
  const [stage, setStage] = useState(1);
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [subordinates, setSubordinates] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const decline = () => {
    setShowConfirmPopUp(false);
    setNewEmployee({ ...newEmployee, isManager: false });
    addToDB();
  };
  const confirm = () => {
    setStage(2);
    setShowConfirmPopUp(false);
    setNewEmployee({ ...newEmployee, isManager: true });
  };
  const addToDB = async () => {
    setStage(3);
    const employeeData = {
      ...newEmployee,
      subordinates: subordinates,
    };
    console.log(employeeData);
    try {
      const response = await addEmployee(employeeData);
      setResponseMessage(response.message);
      setShowPopUp(true);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setResponseMessage("Wystąpił błąd podczas komunikacji z serwerem.");
      setShowPopUp(true);
    } finally {
      setStage(1);
    }
  };
  return (
    <>
      {stage === 1 ? (
        <NewEmployeeForm
          setShowPopUp={setShowConfirmPopUp}
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
        show={showConfirmPopUp}
        decline={decline}
        confirm={confirm}
        title={"Powiadomienie"}
        message={"Czy ten pracownik ma być czyimś przełozonym?"}
        declineText={"Nie"}
        confirmText={"Tak"}
      />
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        message={responseMessage}
        title={"Powiadomienie"}
      />
    </>
  );
};

export default NewEmployee;
