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
import { myDirectSubordinatesAPI } from "../../../../api/employeesApi";
import PopUp from "../../../common/PopUp";
import { useAuth } from "../../Login/AuthContext";

const FormPopUp = ({ show, setShow, employee }) => {
  const { setShowPopUp, setReloadPopUp, setShowPopUpLogout, setMessage } =
    useAuth();

  const nameRef = useRef();
  const lastNameRef = useRef();
  const mailRef = useRef();
  const phoneNumberRef = useRef();
  const [department, setDepartment] = useState();
  const [position, setPosition] = useState();
  const [directSupervisors, setDirectSupervisors] = useState(
    employee.przelozeni
  );
  const [workingTime, setWorkingTime] = useState();
  const [subordinates, setSubordinates] = useState([]);
  const [directSubordinates, setDirectSubordinates] = useState([]);

  const save = async (
    shouldShowPopUp = true,
    subordinates = directSubordinates
  ) => {
    const employeeData = {
      ID: employee.ID,
      name: nameRef.current?.value || employee.Imie,
      lastname: lastNameRef.current?.value || employee.Nazwisko,
      mail: mailRef.current?.value
        ? mailRef.current.value + "@elerte.pl"
        : employee.Mail,
      phoneNumber: phoneNumberRef.current?.value || employee.NrTelefonu,
      departmentID: department,
      positionID: position,
      supervisors: directSupervisors,
      workingTimeID: workingTime,
      subordinates: subordinates,
    };
    try {
      console.log(employeeData);

      const response = await updateEmployeeApi(employeeData);
      if (shouldShowPopUp) {
        setShow(false);
        setReloadPopUp(true);
        setMessage(response.message);
        setShowPopUp(true);
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setMessage(error.message);
      setShowPopUpLogout(true);
      if (shouldShowPopUp) {
        setShow(false);
        setShowPopUp(true);
        setReloadPopUp(false);
      }
    } finally {
      getDirectSubordinates();
      getSubordinates();
    }
  };

  const deleteEmployee = async () => {
    try {
      const response = await deleteEmployeeApi(employee.ID);
      setMessage(response.message);
      setShow(false);
      setShowPopUp(true);
      setReloadPopUp(false);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setMessage(error.message);
      setShowPopUpLogout(true);
      setShow(false);
    }
  };

  const getSubordinates = async () => {
    try {
      const data = await subordinatesApi(employee.ID);
      const subordinatesID = data.data.map((employee) => employee.ID);
      setSubordinates(subordinatesID);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getDirectSubordinates = async () => {
    try {
      const data = await myDirectSubordinatesAPI(employee.ID);
      const directSubordinatesID = data.map((employee) => employee.ID);
      setDirectSubordinates(directSubordinatesID);
    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    if (show) {
      getSubordinates();
      getDirectSubordinates();
    }
  }, [show, employee]);

  const updateData = async (directSubordinates) => {
    await save(false, directSubordinates); // Wywołaj save bez pokazywania PopUp
    await getDirectSubordinates();
    await getSubordinates();
  };

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
                directSupervisors={directSupervisors}
                setDirectSupervisors={setDirectSupervisors}
                subordinates={subordinates}
                workingTime={workingTime}
                setWorkingTime={setWorkingTime}
              />
            </Tab>
            <Tab eventKey='subordinates' title='Podwładni'>
              <SubordinatesForm
                employee={employee}
                subordinates={subordinates}
                setSubordinates={setSubordinates}
                directSubordinates={directSubordinates}
                setDirectSubordinates={setDirectSubordinates}
                department={department}
                updateData={updateData}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <Button variant='secondary' onClick={deleteEmployee}>
            Usuń
          </Button>
          <div>
            <Button
              variant='secondary'
              className='me-2'
              onClick={() => setShow(false)}>
              Zamknij
            </Button>
            <Button variant='primary' onClick={save}>
              Zapisz zmiany
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FormPopUp;
