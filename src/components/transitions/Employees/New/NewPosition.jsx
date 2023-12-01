import React, { useEffect, useRef, useState } from "react";
import ConfirmPupUp from "../../../common/ConfirmPopUp";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { departmentsApi } from "../../../../api/departmentsApi";
import { addPositionApi } from "../../../../api/positionApi";
import { useAuth } from "../../Login/AuthContext";

const NewPosition = ({ show, cancel }) => {
  const { setShowPopUp, setShowPopUpLogout, setMessage } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState();

  const name = useRef();

  const getAllDepartments = async () => {
    const data = await departmentsApi();
    setDepartments(data);
    setDepartment(data[0].ID);
  };
  const onChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  const submit = async () => {
    try {
      const newPosition = {
        name: name.current.value,
        Dzial_ID: department,
      };
      const response = await addPositionApi(newPosition);
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

  useEffect(() => {
    if (show) {
      getAllDepartments();
    }
  }, [show]);
  return (
    <ConfirmPupUp
      show={show}
      hide={cancel}
      title={"Nowe stanowisko"}
      decline={cancel}
      declineText={"Anuluj"}
      confirmText={"Zapisz"}
      confirm={submit}>
      <>
        <FloatingLabel controlId='floatingSelect' label='Dział'>
          <Form.Select
            value={department}
            aria-label='Floating label select example'
            onChange={onChangeDepartment}>
            {departments.map((department) => (
              <option value={department.ID} key={department.ID}>
                {department.Nazwa}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel
          controlId='position'
          label='Nazwa stanowiska'
          className='mb-3'>
          <Form.Control type='text' placeholder='nicciekawego' ref={name} />
        </FloatingLabel>
      </>
    </ConfirmPupUp>
  );
};

export default NewPosition;
