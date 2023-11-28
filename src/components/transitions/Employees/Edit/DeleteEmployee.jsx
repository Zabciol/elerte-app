import React, { useState } from "react";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import Form from "react-bootstrap/Form";
import {
  getNextWorkDay,
  getLastDayOfThisMonth,
} from "../../../common/CommonFunctions";
import { fillECPforDeletedEmployeeApi } from "../../../../api/ecpApi";
import { useAuth } from "../../Login/AuthContext";

const DeleteEmployee = ({ show, setShow, hide, employee, user }) => {
  const { setShowPopUp, setShowPopUpLogout, setMessage } = useAuth();
  const [date, setDate] = useState(getLastDayOfThisMonth);
  const confirm = async () => {
    setShow(false);
    const data = {
      startDate: getNextWorkDay(),
      endDate: date,
      employeeID: employee.ID,
      editEmployeeID: user.ID,
    };
    try {
      const result = await fillECPforDeletedEmployeeApi(data);
      setMessage(result.message);
      setShowPopUp(true);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
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
      <div className='d-flex align-items-center justify-content-around'>
        <h5 className='m-1'>Z dniem</h5>
        <Form.Control
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='menu-select m-1'
        />
      </div>
    </ConfirmPupUp>
  );
};

export default DeleteEmployee;
