import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Variables from "../../common/CommonFunctions";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { getECPAbsence } from "../../../api/ecpApi";

const MenuItems = ({ date, setDate }) => {
  return (
    <Form.Control
      type='month'
      value={date}
      className='me-2'
      aria-label='Miesiąc'
      onChange={setDate}
    />
  );
};

const Calender = (props) => {
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [absence, setAbsence] = useState([]);
  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const getAbsence = async (employeesID) => {
    const data = await getECPAbsence(date, employeesID);
    console.log(data);
  };

  useEffect(() => {
    const employeesID = props.subordinates.map((employee) => employee.ID);
    getAbsence(employeesID);
  }, []);

  useEffect(() => {
    props.setMenuItems(
      <MenuItems date={date} setDate={changeDate}></MenuItems>
    );
  }, [date]);
  return <div>Calender</div>;
};

export default Calender;
