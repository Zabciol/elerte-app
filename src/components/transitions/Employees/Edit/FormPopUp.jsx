import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ContactForm from "./ContactForm";
import NewEmployeeForm from "../NewEmployee/NewEmployeeForm";
import PositionForm from "./PositionForm";

const FormPopUp = ({ show, setShow, employee }) => {
  console.log(employee);
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
            <ContactForm employee={employee} />
          </Tab>
          <Tab eventKey='position' title='Stanowisko'>
            <PositionForm employee={employee} />
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant='primary'>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormPopUp;
