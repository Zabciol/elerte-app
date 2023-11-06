import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import generujEventy from "./getEvents";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { getECPAPI } from "../../../api/ecpApi";
import FullCalender from "./FullCalender";
import { SelectDzial } from "../../layout/Menu/MenuForms";

const MenuItems = ({ date, setDate, dzial, dzialy, setDzial }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
      <Form.Control
        type='month'
        value={date}
        className='me-2'
        aria-label='Miesiąc'
        onChange={setDate}
      />
    </>
  );
};

const Calender = (props) => {
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [events, setEvents] = useState([]);
  const dzialy = Array.from(
    new Set(props.subordinates.map((item) => item.Dzial))
  );
  const [dzial, setDzial] = useState(dzialy[0]);
  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const getAbsence = async (employeesID) => {
    const data = await getECPAPI(date, employeesID);
    var preEvents = [];
    for (let pracownik of data) {
      let events = await generujEventy(pracownik);
      preEvents.push(...events);
    }
    return preEvents;
  };

  const getEmployeesID = () => {
    const employeesID =
      dzial === "Każdy"
        ? props.subordinates.map((employee) => employee.ID)
        : props.subordinates
            .filter((employee) => employee.Dzial === dzial)
            .map((employee) => employee.ID);
    return employeesID;
  };

  const fetchData = async () => {
    const employeesID = getEmployeesID();
    const data = await getAbsence(employeesID);
    setEvents(data);
  };

  useEffect(() => {
    fetchData();
    props.setMenuItems(
      <MenuItems
        date={date}
        setDate={changeDate}
        dzial={dzial}
        dzialy={dzialy}
        setDzial={setDzial}></MenuItems>
    );
  }, [date, dzial]);
  return <FullCalender events={events} setDate={setDate}></FullCalender>;
};

export default Calender;
