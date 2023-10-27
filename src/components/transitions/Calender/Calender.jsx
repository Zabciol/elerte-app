import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Variables from "../../common/CommonFunctions";
//import analyzeAttendance from "./analyzeAttendance";
import generujEventy from "./getEvents";
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
  const [events, setEvents] = useState([]);
  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const getAbsence = async (employeesID) => {
    const data = await getECPAbsence(date, employeesID);
    console.log(data);
    var preEvents = [];
    for (let pracownik of data) {
      let events = await generujEventy(pracownik);
      preEvents.push(...events);
    }
    console.log(preEvents);
    return preEvents;
  };

  useEffect(() => {
    const employeesID = props.subordinates.map((employee) => employee.ID);
    console.log(employeesID);
    const data = getAbsence(employeesID);
    setEvents(data);
  }, []);

  useEffect(() => {
    props.setMenuItems(
      <MenuItems date={date} setDate={changeDate}></MenuItems>
    );
  }, [date]);
  return <div>Calender</div>;
};

export default Calender;
