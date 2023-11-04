import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ContactForm from "./ContactForm";
import NewEmployeeForm from "../NewEmployee/NewEmployeeForm";
import PositionForm from "./PositionForm";
import SubordinatesForm from "./SuborfinatesForm";
import { subordinatesApi } from "../../../../api/employeesApi";

const FormPopUp = ({ show, setShow, employee }) => {
  const mailRef = useRef();
  const phoneNumberRef = useRef();
  const [department, setDepartment] = useState();
  const [position, setPosition] = useState();
  const [supervisor, setSupervisor] = useState();
  const [workingTime, setWorkingTime] = useState();
  const [subordinates, setSubordinates] = useState([]);

  const save = () => {
    const newEmployee = {
      ID: employee.ID,
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
    console.log(newEmployee);
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
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edycja pracownika</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          defaultActiveKey='contact'
          id='uncontrolled-tab-example'
          className='mb-3'>
          <Tab eventKey='contact' title='Kontakt'>
            <ContactForm
              employee={employee}
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
        <Button variant='secondary' onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant='primary' onClick={save}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormPopUp;
