import React from "react";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ContactForm from "../Edit/ContactForm";
import PositionForm from "../Edit/PositionForm";
import NewVacation from "./NewVacation";
import SubordinatesForm from "../Edit/SuborfinatesForm";
import { subordinatesApi, supervisorsApi } from "../../../../api/employeesApi";
import { updateEmployeeApi } from "../../../../api/employeesApi";
import { deleteEmployeeApi } from "../../../../api/employeesApi";
import { myDirectSubordinatesAPI } from "../../../../api/employeesApi";
import PopUp from "../../../common/PopUp";
import { useAuth } from "../../Login/AuthContext";

const NewEmployee = ({ show, cancel }) => {
  const { setShowPopUp, setReloadPopUp, setShowPopUpLogout, setMessage } =
    useAuth();

  const nameRef = useRef();
  const lastNameRef = useRef();
  const mailRef = useRef();
  const phoneNumberRef = useRef();
  const [department, setDepartment] = useState();
  const [position, setPosition] = useState();
  const [supervisor, setSupervisor] = useState();
  const [workingTime, setWorkingTime] = useState();
  const [subordinates, setSubordinates] = useState([]);
  const [directSubordinates, setDirectSubordinates] = useState([]);
  const [usedDays, setUsedDays] = useState(0);
  const [pastDays, setPastDays] = useState(0);
  const [maxCountOfDays, setMaxCountOfDays] = useState(26);

  const employee = {
    DzialID: 2,
    Imie: "Jan",
    Mail: "jan.kowalski@elerte.pl",
    Nazwisko: "Kowalski",
    NrTelefonu: "123-456-789",
    PrzelozonyID: null,
    StanowiskoID: null,
    WymiarPracy_ID: null,
  };
  function isAnyValueEmpty(obj) {
    return Object.values(obj).some(
      (value) => value === null || value === undefined || value === ""
    );
  }

  const submit = async () => {
    const newEmployee = {
      name: nameRef.current.value,
      lastname: lastNameRef.current.value,
      mail: mailRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      positionID: position,
      departmentID: department,
      workingTime: workingTime,
      supervisorID: supervisor,
      vacation: {
        maxCountOfDays: maxCountOfDays,
        pastDays: pastDays,
        usedDays: usedDays,
      },
    };
    try {
      const { mail, phoneNumber, ...toCheck } = newEmployee;
      if (isAnyValueEmpty(toCheck)) throw new Error("Uzupełnij dane");
      if (isAnyValueEmpty(toCheck.vacation))
        throw new Error("Uzupełnij dane urlopowe");
      console.log(newEmployee);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUp(true);
    }
  };

  return (
    <ConfirmPupUp
      show={show}
      hide={cancel}
      title={"Nowy pracownik"}
      decline={cancel}
      declineText={"Anuluj"}
      confirmText={"Zapisz"}
      confirm={submit}>
      <Tabs
        defaultActiveKey='main'
        id='uncontrolled-tab-example'
        className='mb-3'>
        <Tab eventKey='main' title='Główne'>
          <ContactForm
            employee={employee}
            nameRef={nameRef}
            lastNameRef={lastNameRef}
            mailRef={mailRef}
            phoneNumberRef={phoneNumberRef}
          />
        </Tab>
        <Tab eventKey='position' title='Stanowisko'>
          <PositionForm
            employee={employee}
            department={department}
            setDepartment={setDepartment}
            position={position}
            setPosition={setPosition}
            supervisor={supervisor}
            setSupervisor={setSupervisor}
            subordinates={subordinates}
            workingTime={workingTime}
            setWorkingTime={setWorkingTime}
          />
        </Tab>
        <Tab eventKey='vacation' title='Urlop'>
          <NewVacation
            usedDays={usedDays}
            setUsedDays={setUsedDays}
            pastDays={pastDays}
            setPastDays={setPastDays}
            maxCountOfDays={maxCountOfDays}
            setMaxCountOfDays={setMaxCountOfDays}
          />
        </Tab>
      </Tabs>
    </ConfirmPupUp>
  );
};

export default NewEmployee;