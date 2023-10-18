import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function PopUp(props) {
  const [fullscreen, setFullscreen] = useState(true);

  return (
    <>
      <Modal
        size='sm'
        show={props.show}
        onHide={() => props.setShow(false)}
        aria-labelledby='example-modal-sizes-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='example-modal-sizes-title-sm'>
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
      </Modal>
    </>
  );
}

export default PopUp;
