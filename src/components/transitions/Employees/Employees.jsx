import React, { useState, useEffect } from "react";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import EmployeesList from "./EmployeesList";
import EmployeeInf from "./EmployeeInf";
import NewEmployee from "./NewEmployee/NewEmployee";
import ExportExcel from "./ExportExcel";
import EmployeesAbsence from "./Absence/EmployeesAbsence";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";

const MenuItems = ({ dzial, dzialy, setDzial, date, setDate }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
      <Form.Control
        type='month'
        value={date}
        onChange={setDate}
        className='menu-select'
      />
    </>
  );
};

const Employees = ({ user, setMenuItems, subordinates }) => {
  const [dzialy, setDzialy] = useState([]);
  const [dzial, setDzial] = useState();
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [filteredSubordinates, setFilteredSubordinates] =
    useState(subordinates);

  const changeDate = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    const noweDzialy = Array.from(
      new Set(subordinates.map((item) => item.Dzial))
    );
    setDzialy(noweDzialy);
    setDzial(noweDzialy[0]);
  }, [subordinates]);

  useEffect(() => {
    if (subordinates.length) {
      console.log(subordinates);
      const newFilteredSubordinates =
        dzial === "Każdy"
          ? subordinates
          : subordinates.filter((employee) => employee.Dzial === dzial);
      setFilteredSubordinates(newFilteredSubordinates);
    }
  }, [dzial, subordinates]);

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={dzial}
        dzialy={dzialy}
        setDzial={setDzial}
        date={date}
        setDate={changeDate}
      />
    );
  }, [dzial, date, dzialy]);

  const [key, setKey] = useState("Lista");

  return (
    <Tabs
      id='controlled-tab-example'
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className='mb-3'>
      <Tab eventKey='Lista' title='Lista'>
        <EmployeesList
          subordinates={filteredSubordinates}
          dzial={dzial}
          user={user}
          date={date}
          showWorkedHours={true}>
          <EmployeeInf user={user} />
        </EmployeesList>
      </Tab>
      <Tab eventKey='Nieobecnosci' title='Nieobecności'>
        <EmployeesAbsence date={date} subordinates={filteredSubordinates} />
      </Tab>
      <Tab eventKey='Excel' title='Export'>
        {" "}
        <ExportExcel
          subordinates={subordinates}
          user={user}
          dzial={dzial}
          date={date}
        />
      </Tab>
      <Tab
        eventKey='Nowy'
        title='Nowy'
        disabled={user.Dzial === "Księgowość" ? false : true}>
        <NewEmployee dzial={dzial} />
      </Tab>
    </Tabs>
  );
};

export default Employees;
