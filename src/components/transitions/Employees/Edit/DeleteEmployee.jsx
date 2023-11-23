import React, { useState } from "react";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import Form from "react-bootstrap/Form";
import { getNextWorkDay } from "../../../common/CommonFunctions";

const DeleteEmployee = ({ show, setShow, hide }) => {
  const [date, setDate] = useState(getNextWorkDay());

  console.log(date);
  const confirm = async () => {
    setShow(false);
  };

  return (
    <ConfirmPupUp
      show={show}
      hide={hide}
      title='Zwolnij pracownika'
      confirm={confirm}
      confirmText='Potwierdź'
      decline={hide}
      declineText='Anuluj'>
      <>
        {" "}
        <Form.Control
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='menu-select'
        />
      </>
    </ConfirmPupUp>
  );
};

export default DeleteEmployee;
