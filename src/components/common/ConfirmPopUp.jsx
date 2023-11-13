import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmPupUp({
  show,
  hide,
  title,
  decline,
  declineText,
  confirm,
  confirmText,
  children,
}) {
  return (
    <Modal show={show} onHide={hide} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {declineText ? (
          <Button variant='secondary' onClick={decline}>
            {declineText}
          </Button>
        ) : null}
        <Button variant='primary' onClick={confirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmPupUp;
