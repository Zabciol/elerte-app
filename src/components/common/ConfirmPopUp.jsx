import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmPupUp(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.decline}
      backdrop='static'
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.decline}>
          {props.declineText}
        </Button>
        <Button variant='primary' onClick={props.confirm}>
          {props.confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmPupUp;
