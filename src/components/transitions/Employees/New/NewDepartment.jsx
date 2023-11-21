import React, { useRef } from "react";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useAuth } from "../../Login/AuthContext";
import { addDepartmentApi } from "../../../../api/departmentsApi";

const NewDepartment = ({ show, cancel }) => {
  const { setShowPopUp, setShowPopUpLogout, setMessage } = useAuth();
  const name = useRef();

  const submit = async () => {
    console.log(name.current.value);
    try {
      const newDepartment = {
        name: name.current.value,
      };
      const response = await addDepartmentApi(newDepartment);
      setMessage(response.message);
      setShowPopUp(true);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setMessage(error.message);
      setShowPopUpLogout(true);
    } finally {
      cancel();
    }
  };

  return (
    <ConfirmPupUp
      show={show}
      hide={cancel}
      title={"Nowy dział"}
      decline={cancel}
      declineText={"Anuluj"}
      confirmText={"Zapisz"}
      confirm={submit}>
      <FloatingLabel
        controlId='department'
        label='Nazwa działu'
        className='mb-3'>
        <Form.Control type='text' placeholder='nicciekawego' ref={name} />
      </FloatingLabel>
    </ConfirmPupUp>
  );
};

export default NewDepartment;
