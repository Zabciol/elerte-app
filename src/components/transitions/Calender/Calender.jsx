import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import generujEventy from "./getEvents";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { getECPAPI } from "../../../api/ecpApi";
import FullCalender from "./FullCalender";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import { useAuth } from "../Login/AuthContext";
import { allEmployeesAPI } from "../../../api/employeesApi";

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
  const { setShowPopUpLogout } = useAuth();
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [events, setEvents] = useState([]);
  const [dzialy, setDzialy] = useState(
    Array.from(new Set(props.subordinates.map((item) => item.Dzial)))
  );
  const [dzial, setDzial] = useState(dzialy[0]);
  const [employees, setEmployees] = useState(props.subordinates);

  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const getAbsence = async (employeesID) => {
    try {
      const data = await getECPAPI(date, employeesID);
      var preEvents = [];
      for (let pracownik of data) {
        let events = await generujEventy(pracownik);
        preEvents.push(...events);
      }
      return preEvents;
    } catch (error) {
      setShowPopUpLogout(true);
    }
  };

  const getEmployeesID = (employees) => {
    const employeesID =
      dzial === "Każdy"
        ? employees.map((employee) => employee.ID)
        : employees
            .filter((employee) => employee.Dzial === dzial)
            .map((employee) => employee.ID);
    return employeesID;
  };

  const fetchData = async () => {
    const employeesID = getEmployeesID(employees);
    const data = await getAbsence(employeesID);
    setEvents(data);
  };

  const getEmployees = async () => {
    if (props.user.Uprawnienia === 2 || props.user.Uprawnienia === 4) {
      const data = await allEmployeesAPI();
      setEmployees(data);
      setDzialy(Array.from(new Set(data.map((item) => item.Dzial))));
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

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
  }, [date, dzial, dzialy]);
  return <FullCalender events={events} setDate={setDate}></FullCalender>;
};

export default Calender;
