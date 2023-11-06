import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ContactForm from "./ContactForm";
import PositionForm from "./PositionForm";
import SubordinatesForm from "./SuborfinatesForm";
import { subordinatesApi } from "../../../../api/employeesApi";
import { updateEmployeeApi } from "../../../../api/employeesApi";
import { deleteEmployeeApi } from "../../../../api/employeesApi";
import PopUp from "../../../common/PopUp";

const FormPopUp = ({ show, setShow, employee }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [message, setMessage] = useState("");
  const [onReload, setOnReaload] = useState(false);

  const nameRef = useRef();
  const lastNameRef = useRef();
  const mailRef = useRef();
  const phoneNumberRef = useRef();
  const [department, setDepartment] = useState();
  const [position, setPosition] = useState();
  const [supervisor, setSupervisor] = useState();
  const [workingTime, setWorkingTime] = useState();
  const [subordinates, setSubordinates] = useState([]);

  const save = async () => {
    const employeeData = {
      ID: employee.ID,
      name:
        nameRef.current.value !== "" ? nameRef.current.value : employee.Imie,
      lastname:
        lastNameRef.current.value !== ""
          ? lastNameRef.current.value
          : employee.Nazwisko,
      mail:
        mailRef.current.value !== ""
          ? mailRef.current.value + "@elerte.pl"
          : employee.Mail,
      phoneNumber:
        phoneNumberRef.current.value !== ""
          ? phoneNumberRef.current.value
          : employee.NrTelefonu,
      departmentID: department,
      positionID: position,
      supervisorID: supervisor,
      workingTimeID: workingTime,
      subordinates: subordinates,
    };
    console.log(employeeData);
    try {
      const response = await updateEmployeeApi(employeeData);
      setMessage(response.message);
      setShow(false);
      setShowPopUp(true);
      setOnReaload(true);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setMessage("Wystąpił błąd podczas komunikacji z serwerem.");
      setShow(false);
    }
  };

  const deleteEmployee = async () => {
    try {
      const response = await deleteEmployeeApi(employee.ID);
      setMessage(response.message);
      setShow(false);
      setShowPopUp(true);
      setOnReaload(false);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setMessage("Wystąpił błąd podczas komunikacji z serwerem.");
      setShow(false);
    }
  };

  const getSubordinates = async () => {
    const data = await subordinatesApi(employee.ID);
    const subordinatesID = data.data.map((employee) => employee.ID);
    setSubordinates(subordinatesID);
  };

  useEffect(() => {
    getSubordinates();
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Edycja pracownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                workingTime={workingTime}
                setWorkingTime={setWorkingTime}
              />
            </Tab>
            <Tab eventKey='subordinates' title='Podwładni'>
              <SubordinatesForm
                employee={employee}
                subordinates={subordinates}
                setSubordinates={setSubordinates}
                department={department}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={deleteEmployee}>
            Usuń
          </Button>
          <Button variant='secondary' onClick={() => setShow(false)}>
            Zamknij
          </Button>
          <Button variant='primary' onClick={save}>
            Zapisz zmiany
          </Button>
        </Modal.Footer>
      </Modal>
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        message={message}
        title='Powiadomienie'
        reload={true}
      />
    </>
  );
};

export default FormPopUp;
