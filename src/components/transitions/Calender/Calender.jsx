import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Variables from "../../common/CommonFunctions";
import generujEventy from "./getEvents";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { getECP } from "../../../api/ecpApi";
import FullCalender from "./FullCalender";

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
    const data = await getECP(date, employeesID);
    var preEvents = [];
    for (let pracownik of data) {
      let events = await generujEventy(pracownik);
      preEvents.push(...events);
    }
    //setEvents(preEvents);
    //console.log(preEvents);
    return preEvents;
  };
  const fetchData = async () => {
    const employeesID = props.subordinates.map((employee) => employee.ID);
    const data = await getAbsence(employeesID);
    setEvents(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    props.setMenuItems(
      <MenuItems date={date} setDate={changeDate}></MenuItems>
    );
  }, [date]);
  return <FullCalender events={events} setDate={setDate}></FullCalender>;
};

export default Calender;
